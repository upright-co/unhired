import type { Metadata } from "next";
import { PilotPage } from "@/components/pilot/PilotPage";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: { absolute: "Free AI Employee Pilot for Edmonton Businesses · Unhired" },
  description:
    "We come to your business, interview your team, map the work AI can take on, then build your first AI Employee and put it to work so you can see the value. Free. 5 spots a month.",
  alternates: { canonical: "/pilot" },
  // Ad landing page: keep it out of search results.
  robots: { index: false, follow: false },
  openGraph: {
    url: "/pilot",
    title: "Your first AI Employee, built free",
    description: "An in-person AI visit for Edmonton businesses, plus a free AI Employee built and put to work in your business. 5 spots a month.",
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
