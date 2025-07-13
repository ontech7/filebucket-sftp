import { formatSftpRemotePath, sftpConfig } from "@/lib/sftp";
import { getCollection } from "@/utils/services/collection";
import { getFile } from "@/utils/services/file";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import SftpClient from "ssh2-sftp-client";
import { PassThrough } from "stream";
import { ReadableStream } from "stream/web";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ folder: string; name: string }> }
) => {
  try {
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

    const passThrough = new PassThrough();
    sftp.get(formatSftpRemotePath(folder, name), passThrough);
    const nodeStream = passThrough;

    const webStream = new ReadableStream({
      async pull(controller) {
        for await (const chunk of nodeStream) {
          controller.enqueue(chunk);
        }
        controller.close();
        sftp.end();
      },
      cancel() {
        nodeStream.destroy();
        sftp.end();
      },
    });

    return new NextResponse(webStream as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.originalName}"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
};
