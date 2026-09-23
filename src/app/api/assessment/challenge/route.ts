import { NextResponse } from "next/server";
import { issueChallenge } from "@/lib/pow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Hands out a signed proof-of-work challenge for the assessment session. */
export async function GET() {
  return NextResponse.json(issueChallenge(), {
    headers: { "cache-control": "no-store" },
  });
}
