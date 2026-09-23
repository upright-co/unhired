import { NextResponse } from "next/server";
import { assessmentConfig } from "@/config";
import { extractText, UnsupportedFileError } from "@/lib/extract";
import { guard, jsonError } from "@/lib/http";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Extracts text from an uploaded job description (PDF, DOCX, TXT; max 5MB). */
export async function POST(req: Request) {
  const blocked = await guard(req, "extract");
  if (blocked) return blocked;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError("bad_request", "Upload a PDF, DOCX or TXT file.", 400);
  }
  const file = form.get("file");
  if (!(file instanceof File)) return jsonError("bad_request", "No file received.", 400);
  if (file.size > assessmentConfig.maxUploadBytes) {
    return jsonError("bad_request", "That file is over 5MB. Try a smaller file or paste the text.", 400);
  }
  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
  if (!assessmentConfig.acceptedUploadExtensions.includes(ext)) {
    return jsonError("bad_request", "Upload a PDF, DOCX or TXT file.", 400);
  }

  try {
    const { text, truncated } = await extractText(file);
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words < 15) {
      return jsonError(
        "bad_request",
        "We couldn't read much text from that file (scanned PDFs don't work). Try describing the job instead.",
        422,
      );
    }
    return NextResponse.json({ text, truncated, words, filename: file.name });
  } catch (err) {
    if (err instanceof UnsupportedFileError) {
      return jsonError("bad_request", "Upload a PDF, DOCX or TXT file.", 400);
    }
    console.error("[extract] failed", err);
    return jsonError("server_error", "We couldn't read that file. Try another file or describe the job.", 422, true);
  }
}
