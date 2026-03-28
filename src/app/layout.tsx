import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PostPilot",
  description: "AI-native social media automation",
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
