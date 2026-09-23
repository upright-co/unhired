import type { Metadata, Viewport } from "next";
import { Sora, DM_Sans, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/config";
import { Providers } from "@/components/Providers";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-sora",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const title = "Unhired — Let your next hire be AI";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: title, template: "%s · Unhired" },
  description: siteConfig.description,
  applicationName: "Unhired",
  keywords: [
    "AI employees",
    "AI receptionist",
    "AI hire",
    "AI employee",
    "AI for small business",
    "AI staffing agency",
    "AI staffing",
  ],
  icons: {
    icon: [{ url: "/unhired-mark.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", sizes: "512x512" }],
  },
  openGraph: {
    type: "website",
    siteName: "Unhired",
    title,
    description: siteConfig.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F6FB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
