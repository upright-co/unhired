/**
 * Privacy policy content.
 *
 * Written from what the site actually collects and who actually processes it
 * (see src/lib/store.ts, src/lib/email.ts, src/lib/claude.ts). It is NOT legal
 * advice — have a lawyer review it before you rely on it, and update
 * `lastUpdated` plus the relevant section whenever the data flow changes
 * (adding analytics or an ad pixel would need a change to "Cookies").
 */

export const privacy = {
  lastUpdated: "September 23, 2026",
  intro: [
    "Unhired builds AI employees for trade and service businesses. This policy explains what we collect when you use unhired.io, why we collect it, who processes it on our behalf, and how to get it removed.",
    "We collect as little as we can, and we don't sell your information to anyone.",
  ],
  sections: [
    {
      heading: "What we collect when you take the assessment",
      body: [
        "Everything you type into the AI Hire Assessment: the role title, industry and team size, the job description you write or the text extracted from a file you upload, your answers to the follow-up questions, and the wage estimate if you choose to give one.",
        "If you upload a job description, we read the text out of the file and store that text. We don't keep the file itself.",
      ],
      list: null,
    },
    {
      heading: "What we collect at the email step",
      body: [
        "To send your report we ask for your first name, email address and business name. A phone number is optional and only used if we follow up with you.",
      ],
      list: [
        "The exact consent wording you agreed to, and the date and time you agreed to it. This is how we meet Canada's anti-spam law (CASL), which requires express consent before sending commercial email.",
        "Campaign parameters (utm_source, utm_medium, utm_campaign) from the link you arrived on, so we know which channel brought you.",
      ],
    },
    {
      heading: "Technical information",
      body: [
        "We store a one-way hash of your IP address for a short period to rate-limit the assessment and stop automated abuse. We can't reverse it back into your IP address.",
        "We set one cookie, a short-lived session cookie that proves your browser passed our bot check. It holds no personal information and isn't used for advertising or tracking across sites.",
      ],
      list: null,
    },
    {
      heading: "How your report is generated",
      body: [
        "The role details and answers you provide are sent to Anthropic, our AI provider, to produce your AI Employee Opportunity Report. Your job description is treated strictly as information about the role.",
        "Your finished report is stored and given a private link with a random, unguessable address. It isn't listed anywhere or indexed by search engines, but anyone you share that link with can read the report.",
      ],
      list: null,
    },
    {
      heading: "Who processes your data",
      body: ["We use a small number of service providers to run Unhired:"],
      list: [
        "Anthropic — generates your report from the role details you provide.",
        "Supabase — the database where assessments, reports and contact details are stored.",
        "Resend — delivers your report email and holds our contact list.",
        "Vercel — hosts the website.",
        "Porkbun — forwards email sent to our unhired.io addresses.",
        "These providers may process and store data outside Canada, including in the United States.",
      ],
    },
    {
      heading: "What we send you",
      body: [
        "Your report, to the address you gave us. If you ticked the consent box, we also send occasional emails with tips on putting AI employees to work.",
        "Every marketing email includes an unsubscribe link, and unsubscribing takes effect immediately. You can also reply to any of our emails and ask to be removed.",
      ],
      list: null,
    },
    {
      heading: "How long we keep it",
      body: [
        "We keep your assessment and report so your report link keeps working and so we can pick up the conversation where it left off. Rate-limiting records are deleted automatically within days.",
        "Ask us to delete your information and we'll remove it from our database and our contact list.",
      ],
      list: null,
    },
    {
      heading: "How we protect it",
      body: ["The practical measures behind that:"],
      list: [
        "Data is encrypted in transit and at rest by our providers.",
        "Database access is server-side only; credentials live in a secrets store, never in the website code you download.",
        "Each integration gets the least access it needs to do its job.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "You can ask us for a copy of what we hold about you, ask us to correct it, ask us to delete it, or withdraw your consent to marketing email at any time. Email us and we'll action it.",
        "If you're in Canada, you also have the right to complain to the Office of the Privacy Commissioner of Canada.",
      ],
      list: null,
    },
    {
      heading: "Children",
      body: ["Unhired is a service for businesses and isn't directed to anyone under 18."],
      list: null,
    },
    {
      heading: "Changes to this policy",
      body: [
        "If we change how we handle your information, we'll update this page and the date at the top.",
      ],
      list: null,
    },
  ],
};
