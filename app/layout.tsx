import { ProgressProvider } from "@/systems/ProgressProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Birthday Website",
  description: "A personal birthday celebration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Gravitas+One&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Special+Gothic+Expanded+One&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <ProgressProvider>
          {children}
        </ProgressProvider>
      </body>
    </html>
  );
}
