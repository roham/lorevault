import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import UnlockCelebration from "@/components/UnlockCelebration";
import LivePulse from "@/components/LivePulse";
import PrestigeCelebration from "@/components/PrestigeCelebration";
import PWAInstall from "@/components/PWAInstall";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoreVault — Collect the Legends",
  description: "Open packs. Pull legends. Build your vault. Premium digital collectibles from the greatest stories ever told.",
  manifest: "/manifest.json",
  openGraph: {
    title: "LoreVault — Collect the Legends",
    description: "Premium digital collectibles from the greatest stories ever told.",
    siteName: "LoreVault",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LoreVault — Collect the Legends",
    description: "Open packs. Pull legends. Build your vault.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0b14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-background text-foreground">
        <main className="pt-12 pb-[112px]">
          {children}
        </main>
        <UnlockCelebration />
        <PrestigeCelebration />
        <LivePulse />
        <PWAInstall />
        <Navigation />
      </body>
    </html>
  );
}
