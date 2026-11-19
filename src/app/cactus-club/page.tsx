import type { Metadata } from "next";
import { ApplicationPage } from "@/components/application/ApplicationPage";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: { absolute: "Brandon Upright · Video application for Cactus Club Cafe" },
  description:
    "Video application and resume for the AI & Workflow Automation Analyst role at Cactus Club Cafe, offered as a contract through Unhired.",
  alternates: { canonical: "/cactus-club" },
  // A private application for one employer: keep it out of search results.
  robots: { index: false, follow: false },
  openGraph: {
    url: "/cactus-club",
    title: "Brandon Upright · Video application",
    description: "AI & Workflow Automation Analyst, offered as a contract through Unhired.",
  },
};

export default function Page() {
  return (
    <div className="relative">
      <ApplicationPage />
      <Footer minimal />
    </div>
  );
}
