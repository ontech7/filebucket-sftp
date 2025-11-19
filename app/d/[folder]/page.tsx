import { FilePasswordForm } from "@/app/d/[folder]/components/file-password-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetcher } from "@/utils/fetcher";
import { isImage } from "@/utils/file";
import { ArrowLeft, DownloadIcon, FileTextIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type CollectionResponse = {
  message: string;
  data: {
    password: boolean;
    name?: string;
    files: {
      filename: string;
      originalName: string;
      size: number;
      mimeType: string;
    }[];
  };
};

export default async function FolderPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ p: string }>;
  params: Promise<{ folder: string }>;
}) {
  const { folder } = await params;
  const { p: password } = await searchParams;

  const collection = await fetcher<CollectionResponse>(
    `/api/collection/${folder}${password ? `?p=${password}` : ""}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!collection) {
    redirect("/");
  }

  if (collection && collection.data.password && password) {
    redirect(`/d/${folder}`);
  }

  return collection.data.password ? (
    <main className="h-screen max-w-[600px] w-full mx-auto flex justify-center items-center">
      <FilePasswordForm />
    </main>
  ) : (
    <main className="h-screen max-w-[1000px] w-full mx-auto flex flex-col justify-center items-center">
      <Button className="self-start mb-4" asChild>
        <Link href="/">
          <ArrowLeft /> Go back
        </Link>
      </Button>
      <Card className="w-full h-full max-h-[80%]">
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle className="text-2xl">
              {collection.data.name || "Folder"}
            </CardTitle>
            <CardDescription>Your shared files</CardDescription>
          </div>
          <Button asChild>
            <Link href={formatUrl(folder, "zip", password)} target="_blank">
              <DownloadIcon />
              Download all
            </Link>
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="grid grid-cols-4 gap-4 overflow-y-auto h-full">
          {collection.data.files.map((file, i) => (
            <Card key={i} className="p-0 overflow-hidden h-[210px]">
              <Link
                href={formatUrl(folder, file.filename, password)}
                target="_blank"
              >
                <CardContent className="flex justify-center items-center px-0 h-32">
                  {isImage(file.filename) ? (
                    <Image
                      src={formatUrl(
                        folder,
                        `${file.filename}/preview`,
                        password
                      )}
                      alt={file.originalName}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileTextIcon className="size-12" />
                  )}
                </CardContent>
                <Separator />
                <CardFooter className="flex flex-col py-4">
                  <p className="text-sm truncate max-w-[100%]">
                    {file.originalName}
                  </p>
                  <p className="text-muted-foreground text-xs mt-2">
                    {(file.size / 1024).toFixed(2)} kB — {file.mimeType}
                  </p>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

const formatUrl = (folder: string, filename: string, password?: string) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/files/${folder}/${filename}${
    password ? `?p=${password}` : ""
  }`;
};
