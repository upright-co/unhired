/**
 * One place to send analytics events. Plug Meta Pixel / GA4 / anything else in here.
 *
 * Events: assessment_started, step_completed, email_submitted, report_viewed, cta_clicked
 */

export type AnalyticsEvent =
  | "assessment_started"
  | "step_completed"
  | "email_submitted"
  | "report_viewed"
  | "cta_clicked";

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;

  // Google Tag Manager / GA4 via dataLayer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...props });

  // GA4 (gtag.js)
  window.gtag?.("event", event, props);

  // Meta Pixel: map to standard events where it makes sense
  if (window.fbq) {
    if (event === "email_submitted") window.fbq("track", "Lead", props);
    else window.fbq("trackCustom", event, props);
  }

  // Let anything else on the page listen in
  window.dispatchEvent(new CustomEvent("unhired:analytics", { detail: { event, ...props } }));

  if (process.env.NODE_ENV !== "production") {
    console.debug("[trackEvent]", event, props);
  }
}
