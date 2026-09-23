/**
 * "Some of the companies we have built for."
 *
 * All PLACEHOLDER data for now. Any entry whose `name` still contains a
 * [bracketed] placeholder is skipped, and the whole section stays hidden until
 * at least one real company is listed — so nothing unfinished ships publicly.
 *
 * Drop banner images into /public/companies/ and point `banner` at them,
 * e.g. "/companies/northwind.jpg". Banners look best at 16:9, 1200px+ wide.
 */

export type Company = {
  name: string;
  industry: string;
  /** Path under /public. Leave null to show a branded gradient placeholder. */
  banner: string | null;
  roleBuilt: string;
  description: string;
  /** Optional headline result. Leave null to hide. */
  result: string | null;
};

export const companies: Company[] = [
  {
    name: "[Company name]",
    industry: "HVAC",
    banner: null,
    roleBuilt: "AI Receptionist",
    description:
      "[Placeholder: what this AI employee does day to day — answers every call, books service visits into their scheduling software, and follows up on unclosed estimates.]",
    result: "[X% of calls answered]",
  },
  {
    name: "[Company name]",
    industry: "Real Estate",
    banner: null,
    roleBuilt: "AI Transaction Coordinator",
    description:
      "[Placeholder: tracks deadlines, collects documents and signatures, and keeps every party updated through closing.]",
    result: "[X hrs/week saved]",
  },
  {
    name: "[Company name]",
    industry: "Plumbing",
    banner: null,
    roleBuilt: "AI Dispatcher",
    description:
      "[Placeholder: books and reschedules jobs, sends confirmations and reminders, and keeps the dispatch board current for two crews.]",
    result: "[X more jobs booked]",
  },
];
