import type { Metadata } from "next";
import { ContractPage } from "@/components/contract/ContractPage";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: { absolute: "Unhired · Your AI & automation team, at half the cost" },
  description:
    "Our whole AI and automation team working for you, for a flat $3,000 a month. Month to month, cancel anytime.",
  alternates: { canonical: "/contract" },
  // Linked from the QR code on Brandon's job applications only: keep it out of search results.
  robots: { index: false, follow: false },
  openGraph: {
    url: "/contract",
    title: "Your AI & automation team, at half the cost",
    description: "Our whole team instead of one hire, for a flat $3,000 a month.",
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
