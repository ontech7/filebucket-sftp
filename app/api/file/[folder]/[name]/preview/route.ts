import { formatSftpRemotePath, sftpConfig } from "@/lib/sftp";
import { getCollection } from "@/utils/services/collection";
import { isFeatureEnabled } from "@/utils/services/featureFlag";
import { getFile } from "@/utils/services/file";
import { FeatureName } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import SftpClient from "ssh2-sftp-client";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ folder: string; name: string }> }
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

    const { folder, name } = await params;

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

    const file = await getFile({
      folder,
      filename: name,
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const sftp = new SftpClient();
    await sftp.connect(sftpConfig);

    const previewBuffer = await sftp.get(
      formatSftpRemotePath(folder, `preview/${file.filename}`)
    );

    if (!Buffer.isBuffer(previewBuffer)) {
      throw new Error("SFTP is not a buffer");
    }

    await sftp.end();

    return new NextResponse(new Uint8Array(previewBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": "inline",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
};
