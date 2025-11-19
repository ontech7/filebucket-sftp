import "@/styles/globals.css";
import { isFeatureEnabled } from "@/utils/services/featureFlag";
import { FeatureName } from "@prisma/client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FileBucket",
  description:
    "A simple application for uploading and sharing files securely via SFTP.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const platformAvailable = await isFeatureEnabled(
    FeatureName.PLATFORM_AVAILABLE
  );

  if (!platformAvailable?.enabled) {
    return (
      <html lang="en">
        <body>
          <div className="min-h-screen flex items-center justify-center">
            <p>The platform is not available at this time.</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
