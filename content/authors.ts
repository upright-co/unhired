/**
 * Post bylines. A real, named author with a short bio and profile links helps Google
 * trust the content (its "experience, expertise, authority, trust" guidelines).
 */
export type Author = {
  name: string;
  role: string;
  bio: string;
  /** Profile URLs (LinkedIn, YouTube, X). Emitted as `sameAs` in the Article schema. */
  links: { label: string; href: string }[];
};

export const authors = {
  brandon: {
    // Add the YouTube channel to `links` once it exists.
    name: "Brandon Upright",
    role: "Founder, Unhired",
    bio: "Brandon Upright founded Unhired to build, train and maintain AI Employees for growing businesses. He works with owners on one question: which roles on the team should be an AI Employee, and which need a person.",
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/brandon-upright/" }],
  },
  unhired: {
    name: "The Unhired Team",
    role: "Unhired",
    bio: "Unhired builds, trains and maintains AI Employees for growing businesses.",
    links: [],
  },
} satisfies Record<string, Author>;
