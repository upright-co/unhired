import type { Metadata } from "next";
import { siteConfig } from "@/config";
import { Footer } from "@/components/sections/Footer";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = { title: "Privacy policy" };

/** PLACEHOLDER privacy policy. Have it reviewed and replaced before launch. */
export default function Privacy() {
  return (
    <>
      <header className="px-4 pt-5 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <a href="/" aria-label="Unhired home">
            <Logo className="h-7" />
          </a>
        </div>
      </header>
      <main className="px-4 py-14 sm:px-6">
        <article className="mx-auto max-w-3xl space-y-5 leading-relaxed text-muted">
          <p className="label-mono text-violet-deep">[PLACEHOLDER — replace before launch]</p>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-ink">Privacy policy</h1>
          <p>
            This page is a placeholder. Replace it with a privacy policy reviewed for your jurisdictions
            (including PIPEDA/CASL in Canada).
          </p>
          <h2 className="pt-4 text-xl font-semibold text-ink">What the AI Hire Assessment collects</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>The role details, job description and answers you provide.</li>
            <li>Your first name, email, business name and, if you choose, phone number.</li>
            <li>Your consent to receive email, with the time you gave it.</li>
            <li>Campaign parameters from the link you arrived on (UTM tags).</li>
          </ul>
          <h2 className="pt-4 text-xl font-semibold text-ink">How it&apos;s used</h2>
          <p>
            To generate and email your AI Employee Opportunity Report, and to send occasional tips from Unhired.
            You can unsubscribe anytime. Job descriptions are processed by our AI provider to create the report.
          </p>
          <h2 className="pt-4 text-xl font-semibold text-ink">Contact</h2>
          <p>
            Questions or deletion requests:{" "}
            <a className="font-medium text-violet-deep underline" href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>
          </p>
        </article>
      </main>
      <Footer minimal />
    </>
  );
}
