import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Report } from "./schemas";

/**
 * Persistence for assessments. Uses Supabase when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 * are set; otherwise falls back to an in-memory store (local development only).
 */

export type AssessmentRow = {
  id: string;
  created_at: string;
  status: "draft" | "completed";
  role_title: string;
  industry: string;
  team_size: string;
  description: string;
  answers: unknown;
  report: Report;
  coverage_percent: number;
  email: string | null;
  first_name: string | null;
  business: string | null;
  phone: string | null;
  consent_text: string | null;
  consent_at: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

export type DraftInput = Pick<
  AssessmentRow,
  "role_title" | "industry" | "team_size" | "description" | "answers" | "report" | "coverage_percent"
>;

export type ContactInput = Pick<
  AssessmentRow,
  | "email"
  | "first_name"
  | "business"
  | "phone"
  | "consent_text"
  | "consent_at"
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
>;

let supabase: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!supabase) {
    supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return supabase;
}

// Dev-only fallback. Survives hot reloads via globalThis.
const g = globalThis as unknown as { __unhiredMem?: Map<string, AssessmentRow> };
const mem: Map<string, AssessmentRow> = (g.__unhiredMem ??= new Map());
let warned = false;
function warnMemory() {
  if (warned) return;
  warned = true;
  console.warn("[store] Supabase env vars missing: using in-memory store (data is lost on restart).");
}

export async function createDraft(input: DraftInput): Promise<string> {
  const db = getSupabase();
  if (db) {
    const { data, error } = await db
      .from("assessments")
      .insert({ ...input, status: "draft" })
      .select("id")
      .single();
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    return data.id as string;
  }
  warnMemory();
  const id = crypto.randomUUID();
  mem.set(id, {
    id,
    created_at: new Date().toISOString(),
    status: "draft",
    email: null,
    first_name: null,
    business: null,
    phone: null,
    consent_text: null,
    consent_at: null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    ...input,
  });
  return id;
}

export async function getAssessment(id: string): Promise<AssessmentRow | null> {
  const db = getSupabase();
  if (db) {
    const { data, error } = await db.from("assessments").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(`Supabase select failed: ${error.message}`);
    return (data as AssessmentRow) ?? null;
  }
  warnMemory();
  return mem.get(id) ?? null;
}

export async function completeAssessment(id: string, contact: ContactInput): Promise<AssessmentRow> {
  const db = getSupabase();
  if (db) {
    const { data, error } = await db
      .from("assessments")
      .update({ ...contact, status: "completed" })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(`Supabase update failed: ${error.message}`);
    return data as AssessmentRow;
  }
  warnMemory();
  const row = mem.get(id);
  if (!row) throw new Error("Not found");
  const updated: AssessmentRow = { ...row, ...contact, status: "completed" };
  mem.set(id, updated);
  return updated;
}

export async function markDelivery(id: string, fields: { email_sent_at?: string; list_synced_at?: string }) {
  const db = getSupabase();
  if (!db || Object.keys(fields).length === 0) return;
  const { error } = await db.from("assessments").update(fields).eq("id", id);
  if (error) console.error("[store] markDelivery failed", error.message);
}
