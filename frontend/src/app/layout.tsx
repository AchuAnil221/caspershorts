import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Casper Shorts — AI Video to Viral Shorts Generator",
  description: "Transform long-form videos into high-performing YouTube Shorts, Instagram Reels, and TikToks with AI in one click.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased light" style={{ colorScheme: "light" }}>
      <body className="min-h-full flex flex-col font-sans bg-white text-zinc-950" style={{ colorScheme: "light" }}>
        {children}
      </body>
    </html>
  );
}
