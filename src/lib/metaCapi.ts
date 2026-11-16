import { createHash } from "node:crypto";
import { analyticsConfig, pilotConfig } from "@/config";

/**
 * Meta Conversions API: sends the pilot Lead from the server as well as the browser pixel,
 * so applications from iPhones and ad-blockers still reach the campaign. Both carry the same
 * event_id, so Meta counts each application once. Off until META_CAPI_TOKEN is set in Vercel.
 */
const GRAPH = "https://graph.facebook.com/v21.0";

const sha = (s: string) => createHash("sha256").update(s.trim().toLowerCase()).digest("hex");
const digits = (s: string) => {
  const d = s.replace(/\D/g, "");
  return d.length === 10 ? `1${d}` : d; // North American numbers need the country code
};

export type LeadContext = {
  eventId: string | null;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  ip: string | null;
  userAgent: string | null;
  fbp: string | null;
  fbc: string | null;
  sourceUrl: string | null;
};

export async function sendMetaLead(c: LeadContext) {
  const token = process.env.META_CAPI_TOKEN;
  const pixelId = analyticsConfig.metaPixelId;
  if (!token || !pixelId) return;

  const user_data: Record<string, unknown> = {
    em: [sha(c.email)],
    ph: [sha(digits(c.phone))],
    fn: [sha(c.firstName)],
    ln: [sha(c.lastName)],
    ct: [sha(pilotConfig.city.replace(/\s/g, ""))],
    country: [sha("ca")],
  };
  if (c.ip) user_data.client_ip_address = c.ip;
  if (c.userAgent) user_data.client_user_agent = c.userAgent;
  if (c.fbp) user_data.fbp = c.fbp;
  if (c.fbc) user_data.fbc = c.fbc;

  const event = {
    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: c.sourceUrl ?? undefined,
    event_id: c.eventId ?? undefined,
    user_data,
    custom_data: { content_name: "edmonton_pilot" },
  };

  const res = await fetch(`${GRAPH}/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [event] }),
  });
  if (!res.ok) throw new Error(`Meta CAPI ${res.status}: ${(await res.text()).slice(0, 300)}`);
}
