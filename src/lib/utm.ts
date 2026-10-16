const KEY = "unhired_first_touch";
/** How long the first visit is remembered: long enough to cover reading a post now and taking the assessment later. */
const TTL_MS = 90 * 24 * 60 * 60 * 1000;

export type Utm = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  /** Host of the external site that sent the first visit ("www.google.com"), or null for direct visits. */
  referrer: string | null;
  /** Page the first visit landed on ("/blog/ai-receptionist"). */
  landing_path: string | null;
};

const EMPTY: Utm = { utm_source: null, utm_medium: null, utm_campaign: null, referrer: null, landing_path: null };

function clip(s: string | null, max = 200) {
  return s ? s.slice(0, max) : null;
}

function fromThisVisit(): Utm {
  const params = new URLSearchParams(window.location.search);
  let referrer: string | null = null;
  try {
    const host = document.referrer ? new URL(document.referrer).hostname : "";
    if (host && host !== window.location.hostname) referrer = host;
  } catch {
    // Unparseable referrer: treat as direct.
  }
  return {
    utm_source: clip(params.get("utm_source")),
    utm_medium: clip(params.get("utm_medium")),
    utm_campaign: clip(params.get("utm_campaign")),
    referrer: clip(referrer),
    landing_path: clip(window.location.pathname),
  };
}

/**
 * Remembers where a visitor first came from (first touch wins for 90 days), so an
 * assessment taken days after reading a post is still credited to that post's source.
 * A later tagged visit (a campaign link) replaces an untagged first touch.
 */
export function captureUtm() {
  if (typeof window === "undefined") return;
  try {
    const now = fromThisVisit();
    const raw = localStorage.getItem(KEY);
    const saved = raw ? (JSON.parse(raw) as Utm & { at: number }) : null;
    const expired = !saved || Date.now() - saved.at > TTL_MS;
    const upgrade = saved && !saved.utm_source && now.utm_source;
    if (expired || upgrade) localStorage.setItem(KEY, JSON.stringify({ ...now, at: Date.now() }));
  } catch {
    // Storage can be unavailable (private mode); source tracking is best-effort.
  }
}

export function getUtm(): Utm {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const { at: _at, ...saved } = JSON.parse(raw) as Utm & { at: number };
      return { ...EMPTY, ...saved };
    }
    // Storage blocked: fall back to this page's own URL and referrer.
    return fromThisVisit();
  } catch {
    return EMPTY;
  }
}
