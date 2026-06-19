import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Interview Coach",
  description:
    "A polished HR demo that generates structured interview guides with mock AI logic.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
