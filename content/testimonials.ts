/**
 * Results / testimonials. Everything here is PLACEHOLDER data.
 * Replace with real customers (with permission) before launch.
 * `image` is optional: a path under /public, e.g. "/testimonials/acme-logo.png".
 */

export type Testimonial = {
  business: string;
  industry: string;
  roleUnhired: string;
  quote: string;
  person?: string;
  metric: { value: string; label: string };
  image?: string;
};

export const testimonials: Testimonial[] = [
  {
    business: "[Business name]",
    industry: "HVAC",
    roleUnhired: "Receptionist",
    quote: "[Placeholder quote: what changed after the AI receptionist went on shift.]",
    person: "[Owner name], Owner",
    metric: { value: "[X%]", label: "[result metric — e.g. calls answered]" },
  },
  {
    business: "[Business name]",
    industry: "Real Estate",
    roleUnhired: "Transaction Coordinator",
    quote: "[Placeholder quote: how the AI hire handles deadlines and paperwork.]",
    person: "[Broker name], Broker",
    metric: { value: "[X hrs/wk]", label: "[result metric — e.g. admin time saved]" },
  },
  {
    business: "[Business name]",
    industry: "Contractor / Renovation",
    roleUnhired: "Lead Follow-Up",
    quote: "[Placeholder quote: what happened to quote follow-up and close rate.]",
    person: "[Owner name], Owner",
    metric: { value: "[X]", label: "[result metric — e.g. extra jobs booked / month]" },
  },
];
