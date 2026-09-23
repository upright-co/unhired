const KEY = "unhired_utm";

export type Utm = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

/** Stores UTM params from the landing URL (first touch wins for the session). */
export function captureUtm() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Utm = {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    };
    const hasAny = Object.values(utm).some(Boolean);
    if (hasAny && !sessionStorage.getItem(KEY)) {
      sessionStorage.setItem(KEY, JSON.stringify(utm));
    }
  } catch {
    // Storage can be unavailable (private mode); UTM capture is best-effort.
  }
}

export function getUtm(): Utm {
  const empty: Utm = { utm_source: null, utm_medium: null, utm_campaign: null };
  if (typeof window === "undefined") return empty;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return { ...empty, ...JSON.parse(raw) };
    // Fall back to the current URL if storage was blocked
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    };
  } catch {
    return empty;
  }
}
