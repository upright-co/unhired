import { GlowOrbs, GridBackground } from "@/components/ui/Decor";

export default function NotFound() {
  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-4 text-center">
      <GridBackground />
      <GlowOrbs orbs={[{ color: "violet", className: "top-1/4 left-1/3 size-[420px]" }]} />
      <div className="relative">
        <p className="label-mono text-violet-deep">404 · Position not found</p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] sm:text-6xl">This page has been unhired.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The link may be wrong, or the report hasn&apos;t been completed yet.
        </p>
        <a href="/" className="btn btn-primary mt-8 px-7 py-3.5">
          Back to Unhired
        </a>
      </div>
    </main>
  );
}
