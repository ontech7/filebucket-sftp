import { getCollection } from "@/utils/services/collection";
import { isFeatureEnabled } from "@/utils/services/featureFlag";
import { getFiles } from "@/utils/services/file";
import { FeatureName } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
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

    const { name } = await params;

    const collection = await getCollection({
      folder: name,
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

    const files = await getFiles({
      folder: name,
    });

    return NextResponse.json({
      message: "Files retrieved successfully",
      data: {
        password: false,
        name: collection.name,
        files,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Folder not found" }, { status: 404 });
  }
};
