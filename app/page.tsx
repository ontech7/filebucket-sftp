import { isFeatureEnabled } from "@/utils/services/featureFlag";
import { FeatureName } from "@prisma/client";
import { redirect } from "next/navigation";
import { FileUploadForm } from "./components/file-upload-form";

export const revalidate = 600;

export default async function HomePage() {
  const platformAvailable = await isFeatureEnabled(
    FeatureName.PLATFORM_AVAILABLE
  );

  if (!platformAvailable?.enabled) {
    redirect("/unavailable");
  }

  return (
    <main className="h-screen max-w-[600px] w-full mx-auto px-5 flex justify-center items-center">
      <FileUploadForm />
    </main>
  );
}
