import "@/styles/globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FileBucket",
  description:
    "A simple application for uploading and sharing files securely via SFTP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
