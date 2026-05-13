import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Aihrly Phone Screening",
  description: "Phone screening workspace for recruiters and candidates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
