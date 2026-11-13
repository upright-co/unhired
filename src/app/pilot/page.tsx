import type { Metadata } from "next";
import { PilotPage } from "@/components/pilot/PilotPage";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: { absolute: "Free AI Employee Pilot for Edmonton Businesses · Unhired" },
  description:
    "Brandon comes to your business, interviews your team, maps the work AI can take on, and puts your first AI Employee to work for 30 days, free. 8 spots a month.",
  alternates: { canonical: "/pilot" },
  // Ad landing page: keep it out of search results.
  robots: { index: false, follow: false },
  openGraph: {
    url: "/pilot",
    title: "Your first AI Employee, free for 30 days",
    description: "An in-person AI visit for Edmonton businesses, plus an AI Employee built and run for you for a month. 8 spots a month.",
  },
};

export default function Page() {
  return (
    <div className="relative">
      <PilotPage />
      <Footer minimal />
    </div>
  );
}
