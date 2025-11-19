import { formatSftpRemotePath, sftpConfig } from "@/lib/sftp";
import { getCollection } from "@/utils/services/collection";
import { isFeatureEnabled } from "@/utils/services/featureFlag";
import { FeatureName } from "@prisma/client";
import archiver from "archiver";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import SftpClient from "ssh2-sftp-client";
import { PassThrough } from "stream";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ folder: string }> }
) => {
  try {
    const platformAvailable = await isFeatureEnabled(
      FeatureName.PLATFORM_AVAILABLE
    );

    if (!platformAvailable?.enabled) {
      return NextResponse.json(
        { error: "The platform is not available at this time." },
        { status: 503 }
      );
    }

    const { folder } = await params;

    const collection = await getCollection({
      folder,
    });

    const password = req.nextUrl.searchParams.get("p");

    if (!collection) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    if (new Date() > new Date(collection.expiresAt)) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    if (collection.password && !password) {
      return NextResponse.json(
        {
          message: "Password necessary",
          data: {
            password: true,
          },
        },
        { status: 200 }
      );
    }

    if (
      collection.password &&
      password &&
      !(await bcrypt.compare(password, collection.password))
    ) {
      return NextResponse.json(
        {
          message: "Wrong password",
          data: {
            password: true,
          },
        },
        { status: 200 }
      );
    }

    const sftp = new SftpClient();
    await sftp.connect(sftpConfig);

    const files = (await sftp.list(formatSftpRemotePath(folder))).filter(
      (file) => file.name !== "preview"
    );

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files" }, { status: 404 });
    }

    const passthrough = new PassThrough();
    const archive = archiver("zip");

    archive.on("error", (err: any) => {
      throw err;
    });

    archive.pipe(passthrough);

    for (const file of files) {
      const remotePath = formatSftpRemotePath(folder, file.name);
      const sftpStream = await sftp.get(remotePath);

      if (!Buffer.isBuffer(sftpStream)) {
        throw new Error("SFTP is not a buffer");
      }

      archive.append(sftpStream, { name: file.name });
    }

    await sftp.end();

    archive.finalize();

    return new NextResponse(passthrough as any, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${folder}.zip"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Unexpected error" },
      {
        status: 500,
      }
    );
  }
};
