import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config";
import { Footer } from "@/components/sections/Footer";
import { Logo } from "@/components/ui/Logo";
import { validStopToken } from "@/lib/followUps";
import { getAssessment } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Email preferences",
  robots: { index: false, follow: false },
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Unsubscribe page linked from every assessment email. A button posts the form,
 * so opening the link alone (or a mail scanner opening it) changes nothing.
 * Brandon's alert links here with ?stop=<token> to end the follow-ups for one lead.
 */
export default async function Unsubscribe({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ stop?: string; done?: string }>;
}) {
  const { id } = await params;
  const { stop, done } = await searchParams;
  if (!UUID_RE.test(id)) notFound();
  const row = await getAssessment(id).catch(() => null);
  if (!row || row.status !== "completed" || !row.email) notFound();

  const brandon = Boolean(stop && validStopToken(id, stop));
  const alreadyOut = Boolean(row.unsubscribed_at);
  const alreadyStopped = Boolean(row.follow_ups_stopped);

  let heading: string;
  let body: string;
  let showButton = false;
  if (done === "unsubscribed" || (!brandon && alreadyOut)) {
    heading = "You're unsubscribed.";
    body = `${row.email} won't get any more emails from Unhired. Your report is still yours to keep.`;
  } else if (done === "stopped" || (brandon && alreadyStopped)) {
    heading = "Follow-ups stopped.";
    body = `${row.first_name} at ${row.business} won't get any more automatic follow-ups. Anything you send them yourself still goes out.`;
  } else if (brandon) {
    heading = `Stop the follow-ups to ${row.first_name}?`;
    body = `This ends the automatic emails to ${row.email} (${row.business}). They stay subscribed, so you can still write to them.`;
    showButton = true;
  } else {
    heading = "Unsubscribe from Unhired emails?";
    body = `${row.email} will stop getting follow-ups about your report and any tips from us.`;
    showButton = true;
  }

  return (
    <>
      <header className="px-4 pt-5 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" aria-label="Unhired home">
            <Logo className="h-7" />
          </Link>
        </div>
      </header>

      <main className="px-4 py-20 sm:px-6">
        <div className="glass mx-auto max-w-xl rounded-3xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">{heading}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">{body}</p>
          {showButton && (
            <form method="post" action="/api/assessment/unsubscribe" className="mt-8">
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="page" value="1" />
              {brandon && <input type="hidden" name="stop" value={stop} />}
              <button type="submit" className="btn btn-primary px-6 py-3">
                {brandon ? "Stop follow-ups" : "Unsubscribe"}
              </button>
            </form>
          )}
          {!brandon && (
            <p className="mt-8 text-sm text-muted">
              Questions? Write to{" "}
              <a className="font-medium text-violet-deep underline underline-offset-4" href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          )}
        </div>
      </main>

      <Footer minimal />
    </>
  );
}
