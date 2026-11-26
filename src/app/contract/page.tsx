import type { Metadata } from "next";
import { ContractPage } from "@/components/contract/ContractPage";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: { absolute: "Unhired · Your AI automation role, on a monthly retainer" },
  description:
    "Why contracting Unhired for your AI and automation work gets it done sooner: a flat $3,000 a month, month to month, no contract.",
  alternates: { canonical: "/contract" },
  // Linked from the QR code on Brandon's job applications only: keep it out of search results.
  robots: { index: false, follow: false },
  openGraph: {
    url: "/contract",
    title: "Your AI automation role, on a monthly retainer",
    description: "A team instead of one hire, for a flat $3,000 a month.",
  },
};

export default function Page() {
  return (
    <div className="relative">
      <ContractPage />
      <Footer minimal />
    </div>
  );
}
