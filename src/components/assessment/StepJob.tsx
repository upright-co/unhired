"use client";

import { useRef, useState } from "react";
import { ArrowRight, FileText, UploadCloud, X } from "lucide-react";
import { assessmentConfig } from "@/config";
import { assessmentCopy } from "@/content/assessment";
import { ApiError, extractFile } from "./api";
import { BackButton, StepHeading } from "./parts";

export type Upload = { filename: string; text: string; words: number; truncated: boolean };
export type JobState = { mode: "upload" | "describe"; description: string; upload: Upload | null };

export function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function jobText(j: JobState) {
  return j.mode === "upload" ? (j.upload?.text ?? "") : j.description.trim();
}

export function jobValid(j: JobState) {
  return j.mode === "upload"
    ? Boolean(j.upload)
    : wordCount(j.description) >= assessmentConfig.minDescriptionWords;
}

export function StepJob({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: JobState;
  onChange: (v: JobState) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const c = assessmentCopy.job;
  const words = wordCount(value.description);
  const remaining = Math.max(0, assessmentConfig.minDescriptionWords - words);
  const valid = jobValid(value);

  return (
    <div>
      <StepHeading id="assessment-step-heading" title={c.heading} sub={c.sub} />

      <div role="tablist" aria-label="How to share the job" className="mb-5 inline-flex rounded-full bg-ink/[0.05] p-1">
        {(["describe", "upload"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            type="button"
            id={`tab-${m}`}
            aria-selected={value.mode === m}
            aria-controls={`panel-${m}`}
            onClick={() => onChange({ ...value, mode: m })}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all sm:px-5 ${
              value.mode === m ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {m === "upload" ? c.uploadTab : c.describeTab}
          </button>
        ))}
      </div>

      {value.mode === "describe" ? (
        <div role="tabpanel" id="panel-describe" aria-labelledby="tab-describe">
          <label htmlFor="a-desc" className="sr-only">
            {c.describeTab}
          </label>
          <textarea
            id="a-desc"
            className="field min-h-[220px] resize-y leading-relaxed"
            placeholder={c.describePlaceholder}
            value={value.description}
            maxLength={assessmentConfig.maxDescriptionChars}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            aria-describedby="a-desc-count"
          />
          <p id="a-desc-count" className="mt-2 flex items-center justify-between text-sm" aria-live="polite">
            <span className={remaining ? "text-muted" : "font-medium text-green-deep"}>
              {remaining ? c.wordsNeeded(remaining) : c.wordsOk}
            </span>
            <span className="font-mono text-xs text-muted">{words} words</span>
          </p>
        </div>
      ) : (
        <div role="tabpanel" id="panel-upload" aria-labelledby="tab-upload">
          <Uploader upload={value.upload} onUpload={(u) => onChange({ ...value, upload: u })} />
        </div>
      )}

      <div className="mt-9 flex items-center justify-between">
        <BackButton onClick={onBack} />
        <button type="button" disabled={!valid} onClick={onNext} className="btn btn-primary px-7 py-3.5">
          {c.next} <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

function Uploader({ upload, onUpload }: { upload: Upload | null; onUpload: (u: Upload | null) => void }) {
  const c = assessmentCopy.job;
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(file: File | undefined) {
    if (!file) return;
    setError(null);
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!assessmentConfig.acceptedUploadExtensions.includes(ext)) {
      setError("Upload a PDF, DOCX or TXT file.");
      return;
    }
    if (file.size > assessmentConfig.maxUploadBytes) {
      setError("That file is over 5MB. Try a smaller file or describe the job instead.");
      return;
    }
    setBusy(true);
    try {
      const r = await extractFile(file);
      onUpload({ filename: r.filename, text: r.text, words: r.words, truncated: r.truncated });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "We couldn't read that file.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  if (upload) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white/80 p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet/10 text-violet-deep">
            <FileText className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{upload.filename}</p>
            <p className="text-sm text-muted">
              {upload.words} words extracted{upload.truncated ? " (trimmed to the first 15,000 characters)" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onUpload(null)}
            className="grid size-9 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink"
            aria-label="Remove file"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="mt-3 line-clamp-4 rounded-xl bg-mist p-3 font-mono text-xs leading-relaxed whitespace-pre-line text-muted">
          {upload.text.slice(0, 600)}
        </p>
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor="a-file"
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handle(e.dataTransfer.files?.[0]);
        }}
        className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
          drag ? "border-violet bg-violet/5" : "border-ink/15 bg-white/60 hover:border-violet/50"
        } ${busy ? "pointer-events-none opacity-70" : ""}`}
      >
        <span className="bg-signal grid size-12 place-items-center rounded-2xl text-white">
          <UploadCloud className="size-6" aria-hidden />
        </span>
        <span className="mt-4 font-semibold">{busy ? "Reading your file…" : c.uploadCta}</span>
        <span className="label-mono mt-1 text-muted">{c.uploadHint}</span>
        <input
          ref={input}
          id="a-file"
          type="file"
          className="sr-only"
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={(e) => handle(e.target.files?.[0])}
          disabled={busy}
        />
      </label>
      {error && (
        <p className="mt-3 text-sm font-medium text-coral-deep" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
