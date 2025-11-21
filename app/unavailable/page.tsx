import { isFeatureEnabled } from "@/utils/services/featureFlag";
import { FeatureName } from "@prisma/client";
import { CloudOffIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function UnavailablePage() {
  const platformAvailable = await isFeatureEnabled(
    FeatureName.PLATFORM_AVAILABLE
  );

  if (platformAvailable?.enabled) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center gap-4 flex-col">
      <div className="bg-slate-200 p-4 rounded-full">
        <CloudOffIcon className="size-8 text-slate-500" />
      </div>
      <h2 className="tracking-tight text-center text-lg">
        The platform is not available at this time.
      </h2>
    </div>
  );
}
