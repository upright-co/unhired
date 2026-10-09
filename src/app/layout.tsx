import type { Metadata, Viewport } from "next";
import { Sora, DM_Sans, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/config";
import { Providers } from "@/components/Providers";
import { JsonLd } from "@/components/blog/JsonLd";
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

const title = "Unhired | The AI Employee Company";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: title, template: "%s · Unhired" },
  description: siteConfig.description,
  applicationName: "Unhired",
  keywords: [
    "AI employees",
    "AI receptionist",
    "AI Employee",
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

const base = siteConfig.url.replace(/\/$/, "");

/** Tells search engines who Unhired is. Add social profiles to `sameAs` as they go live. */
const orgSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: "Unhired",
    url: `${base}/`,
    logo: `${base}/unhired-logo.png`,
    email: siteConfig.contactEmail,
    description: siteConfig.description,
    knowsAbout: ["AI Employee", "AI Employees", "AI agents", "AI receptionist", "AI for small business"],
    sameAs: ["https://www.linkedin.com/company/unhired-ai-employee/"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: "Unhired",
    url: `${base}/`,
    publisher: { "@id": `${base}/#organization` },
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="min-h-dvh overflow-x-hidden">
        <JsonLd data={orgSchema} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
