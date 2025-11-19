import { formatSftpRemotePath, sftpConfig } from "@/lib/sftp";
import { generateRandomPath } from "@/utils/crypto";
import { isImage } from "@/utils/file";
import { createCollection } from "@/utils/services/collection";
import { isFeatureEnabled } from "@/utils/services/featureFlag";
import { createFile } from "@/utils/services/file";
import { FeatureName } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { extname } from "path";
import sharp from "sharp";
import SftpClient from "ssh2-sftp-client";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const POST = async (req: NextRequest) => {
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

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    const body = {
      name: formData.get("name") as string | undefined,
      password: formData.get("password") as string | undefined,
      expireDays: Number(formData.get("expireDays") || 1),
    };

    if (!files || files.length === 0) {
      return NextResponse.json({ message: "Missing files" }, { status: 400 });
    }

    const uploadFolder = generateRandomPath(24);

    const collection = await createCollection({
      name: body.name,
      folder: uploadFolder,
      password: body.password,
      expireDays: body.expireDays,
    });

    const sftp = new SftpClient();
    await sftp.connect(sftpConfig);

    await sftp.mkdir(formatSftpRemotePath(uploadFolder), true);
    await sftp.mkdir(formatSftpRemotePath(uploadFolder, "preview"), true);

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const fileBuffer = Buffer.from(bytes);

      const ext = extname(file.name).toLowerCase();
      const newFileName = `${generateRandomPath(16)}${ext}`;

      await sftp.put(
        fileBuffer,
        formatSftpRemotePath(uploadFolder, newFileName)
      );

      if (isImage(file.name)) {
        await sftp.put(
          await sharp(fileBuffer).resize(200).jpeg({ quality: 50 }).toBuffer(),
          formatSftpRemotePath(uploadFolder, `preview/${newFileName}`)
        );
      }

      await createFile({
        collectionId: collection.id,
        filename: newFileName,
        originalFilename: file.name,
        mimetype: ext,
        size: file.size,
      });
    }

    await sftp.end();

    return NextResponse.json(
      {
        message: "Files uploaded successfully",
        data: {
          path: `/d/${uploadFolder}`,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 400 });
  }
};
