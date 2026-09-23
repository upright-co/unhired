import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config";
import { getAssessment } from "@/lib/store";
import { ReportView } from "@/components/report/ReportView";
import { Footer } from "@/components/sections/Footer";
import { GlowOrbs, GridBackground } from "@/components/ui/Decor";
import { Logo } from "@/components/ui/Logo";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function load(id: string) {
  if (!UUID_RE.test(id)) return null;
  const row = await getAssessment(id).catch(() => null);
  // Reports are only visible once the email step is complete.
  if (!row || row.status !== "completed" || !row.report) return null;
  return row;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const row = await load(id);
  return {
    title: row ? `AI Employee Opportunity Report: ${row.report.role_title}` : "Report not found",
    robots: { index: false, follow: false },
  };
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await load(id);
  if (!row) notFound();

  const shareUrl = `${siteConfig.url.replace(/\/$/, "")}/report/${row.id}`;

  return (
    <div className="relative isolate overflow-hidden">
      <GridBackground />
      <GlowOrbs
        orbs={[
          { color: "coral", className: "-top-32 -left-32 size-[420px]" },
          { color: "violet", className: "top-40 -right-40 size-[480px]", slow: true },
        ]}
        fade
      />
      <header className="no-print relative z-10 px-4 pt-5 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <a href="/" aria-label="Unhired home">
            <Logo className="h-7" />
          </a>
          <a href="/assessment" className="btn btn-secondary px-4 py-2.5 text-sm">
            Assess another role
          </a>
        </div>
      </header>
      <main className="relative px-4 pt-10 pb-10 sm:px-6">
        <div className="glass-strong relative mx-auto max-w-5xl rounded-[32px] p-5 sm:p-10 lg:p-12">
          <ReportView id={row.id} report={row.report} shareUrl={shareUrl} business={row.business} />
        </div>
      </main>
      <Footer minimal />
    </div>
  );
}
