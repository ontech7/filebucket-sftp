"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { fetcher } from "@/utils/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckIcon,
  CopyIcon,
  HardDriveUploadIcon,
  Loader2Icon,
  UploadCloudIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  name: z.string().optional(),
  expireDays: z.enum(["1", "7", "30"], "Required."),
  password: z.string().optional(),
  files: z
    .any()
    .transform<File[]>((f) => Array.from(f))
    .refine((files) => files.length > 0, "At least one file."),
});

export function FileUploadForm() {
  const [folderPath, setFolderPath] = useState("");

  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      expireDays: "7",
      password: "",
      files: [],
    },
  });

  const expireDays = form.watch("expireDays");
  const hasPassword = !!form.watch("password");

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsUploading(true);

    try {
      if (data.files.length === 0) {
        throw new Error();
      }

      const formData = new FormData();

      Array.from(data.files).forEach((file) => {
        formData.append("files", file);
      });

      formData.append("expireDays", data.expireDays);

      if (data.name) {
        formData.append("name", data.name);
      }

      if (data.password) {
        formData.append("password", data.password);
      }

      const res = await fetcher<{ data: { path: string } }>("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res) {
        throw Error();
      }

      setFolderPath(res.data.path);
    } catch (err) {
      form.setError("root", { message: "Impossible to upload." });
    }

    setIsUploading(false);
  };

  return !folderPath ? (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex gap-2 w-full justify-center">
          <HardDriveUploadIcon className="size-10" />
          <span className="font-semibold text-3xl">FileBucket</span>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {form.formState.errors.root && (
              <div className="text-red-500 text-center">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex gap-2 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-2/3">
                    <FormLabel>Name (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g.: Party photos"
                        disabled={isUploading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expireDays"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Expire Days</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isUploading}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 w-full">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Password (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        disabled={isUploading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 w-full items-center">
              <FormField
                control={form.control}
                name="files"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="w-full">
                    <FormLabel>Files</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        multiple
                        disabled={isUploading}
                        onChange={(event) => onChange(event.target.files)}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 w-full justify-center mt-4">
              {!isUploading ? (
                <Button type="submit" disabled={false}>
                  <UploadCloudIcon />
                  Upload
                </Button>
              ) : (
                <Button type="submit" disabled={true}>
                  <Loader2Icon className="animate-spin" />
                  Uploading...
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  ) : (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex gap-2 w-full justify-center">
          <HardDriveUploadIcon className="size-10" />
          <span className="font-semibold text-3xl">FileBucket</span>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <h2 className="font-semibold text-2xl mb-2">Files transfered!</h2>
        <div className="text-muted-foreground mb-8">
          You can access to your files{" "}
          <Link
            href={folderPath}
            target="_bank"
            className="underline text-blue-500"
          >
            here
          </Link>{" "}
          or copy the link. <br />
          Files will be accessibly only for {expireDays} day(s). <br />
          {hasPassword && "The link is accessible only with the password set."}
        </div>
        <div className="flex gap-2 mb-8">
          <Input
            value={`${window.location.origin}${folderPath}`}
            readOnly
            className="w-full"
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}${folderPath}`
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 1000);
            }}
            disabled={copied}
          >
            {!copied ? (
              <>
                <CopyIcon />
                Copy
              </>
            ) : (
              <>
                <CheckIcon />
                Copied!
              </>
            )}
          </Button>
        </div>

        <div className="text-center">
          <Button asChild>
            <Link href="/">Do a new upload!</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
