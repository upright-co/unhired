/**
 * Brandon's video application to Cactus Club Cafe (AI & Workflow Automation Analyst, Vancouver head office),
 * offered as a contract through Unhired. The digital version of the PDF resume in
 * brand/applications/cactus-club, with the video cover letter on top. Keep the two in step.
 */
const MEDIA = "https://qipricvcuppnnlzvixgn.supabase.co/storage/v1/object/public/site-media/applications/cactus-club";

export const ccApp = {
  video: `${MEDIA}/video-application.mp4`,
  poster: `${MEDIA}/poster.jpg`,
  resumePdf: "/applications/cactus-club/Brandon-Upright-Resume-Cactus-Club.pdf",
  letterPdf: "/applications/cactus-club/Brandon-Upright-Cover-Letter-Cactus-Club.pdf",
  email: "brandon@getunhired.com",
  photo: "/email/brandon-headshot.png",
};

export const ccHero = {
  kicker: "Video application · Cactus Club Cafe",
  headlineBefore: "Brandon Upright for",
  headlineHighlight: "AI & Workflow Automation",
  sub: "A four-minute video in place of a cover letter, with my full resume underneath. I'm offering the role as a contract through my company, Unhired.",
  videoTitle: "Brandon Upright: video application for the AI & Workflow Automation Analyst role",
  facts: ["14 years in hospitality", "5 years building AI systems", "Based in Edmonton, travels to every location", "Contract, well under the posted salary"],
};

export const ccSummary = {
  name: "Brandon Upright",
  role: "Founder, Unhired",
  contact: [
    { label: "Email", value: "brandon@getunhired.com", href: "mailto:brandon@getunhired.com" },
    { label: "Web", value: "unhired.io", href: "https://unhired.io" },
    { label: "LinkedIn", value: "/in/brandon-upright", href: "https://www.linkedin.com/in/brandon-upright" },
  ],
  body: "I spent 14 years in hospitality, working up from server and bartender to floor manager at The Keg and general manager at Rebel Food and Drink, then 5 years building AI systems and automations for companies. Today I run Unhired, where I build workflows, integrations and AI agents on the Anthropic and OpenAI APIs. I'm applying to do this role's work as a contractor through my company, for well under the posted salary, on site at head office and in the restaurants whenever the work needs it.",
};

export const ccMatch = {
  eyebrow: "How I line up with the posting",
  rows: [
    {
      k: "Automation builder",
      tag: "n8n, Make, Zapier, Power Automate",
      v: "Five years of automations that people rely on every day, across the major automation and AI platforms, including n8n, Make, Zapier and Power Automate. All 3 Make Academy levels (Credly certified), Zapier and Microsoft Copilot certified. My own company runs on workflows I built and maintain.",
    },
    {
      k: "Hands-on with AI and APIs",
      tag: "APIs, Python / JS, Snowflake, Sigma",
      v: "I build on the Anthropic, OpenAI and Google APIs in TypeScript, JavaScript and Python, connect systems through webhooks and REST APIs, and work in Claude Code and Codex every day. Experienced with Snowflake and Sigma. All 29 Claude Academy courses and all 8 OpenAI Academy courses completed.",
    },
    {
      k: "Business-minded",
      tag: "Plain language, any team",
      v: "I've sat in the GM's chair, so I know what a kitchen manager or a bookkeeper actually needs from a tool. I've taught more than 5,000 people to use AI without jargon.",
    },
    {
      k: "Practical and self-directed",
      tag: "Loose request to shipped fix",
      v: "Every system listed below I scoped, built, shipped and now support on my own, starting from a one-line problem.",
    },
  ],
};

export type Job = { title: string; where?: string; when: string; sub?: string; points: string[] };

export const ccAiJobs: Job[] = [
  {
    title: "Founder",
    where: "Unhired",
    when: "Present",
    sub: "Builds, trains and maintains AI Employees and automated workflows for growing businesses",
    points: [
      "Built an outbound engine that finds businesses that are hiring, scores each role with Claude, writes a personal email and sends about 450 a day across 15 warmed inboxes, with every reply logged in a CRM.",
      "Built a client portal in Next.js and Supabase, with row-level security so each client sees only its own data: live work log, approvals, flagged items and monthly savings.",
      "Built the AI Employee Assessment, a Claude-powered survey that writes each business owner a personal report. Prompt changes are tested against a 10-scenario simulation before release.",
      "Connected a CRM to four lead sources through webhooks, including booking events and Meta Conversions API leads deduplicated against the browser pixel.",
    ],
  },
  {
    title: "AI Systems Builder, Consultant and Educator",
    when: "5 years",
    points: [
      "Built AI systems, automated workflows, client portals and marketing pipelines for companies.",
      "Taught and advised more than 5,000 people on AI through an online community, courses and short-form video.",
    ],
  },
];

export const ccHospitalityJobs: Job[] = [
  {
    title: "General Manager",
    where: "Rebel Food and Drink",
    when: "2018 – 2024",
    sub: "Century Hospitality Group · server and bartender, then general manager",
    points: [
      "Ran the restaurant day to day: scheduling and labour, ordering and inventory, the point of sale, cash-out and the weekly numbers.",
      "Hired, trained and led front and back of house teams, and handled guests when something went wrong.",
      "Helped the group open new restaurants and retrain staff across its other locations.",
      "Learned first-hand which paperwork, reports and handoffs eat a manager's day, which is the work this role is meant to automate.",
    ],
  },
  {
    title: "Floor Manager",
    where: "The Keg Steakhouse and Bar",
    when: "2012 – 2018",
    sub: "Server and bartender, then floor manager",
    points: ["Ran the floor during service: sections, breaks, guest issues and closing, inside a national brand's standards and systems."],
  },
  { title: "Busser and host", where: "Sawmill Prime Rib and Steakhouse", when: "2010 – 2011", points: [] },
];

export const ccIdeas = {
  eyebrow: "Where I'd look first at Cactus Club",
  items: [
    { t: "HR and onboarding", b: "New hires get chased for missing documents (TD1, void cheque, food safety certificate) and booked into orientation without a manager sending reminders." },
    { t: "Finance and accounts payable", b: "Supplier invoices read by AI, coded and matched to orders before they reach AP, with exceptions flagged for a person." },
    { t: "Point of sale", b: "Each GM gets yesterday's sales, voids and comps in a short summary before their shift, with anything unusual called out." },
    { t: "IT help desk", b: "First answers for common restaurant tickets (printers, POS terminals, password resets) from a knowledge base, handed to IT when it can't solve them." },
    { t: "Data with the BI team", b: "Plain-language questions over Snowflake data, answered from metrics and definitions the BI team has signed off on." },
    { t: "Restaurant managers", b: "Prep and order suggestions built from sales history and upcoming reservations, reviewed by the kitchen before anything is placed." },
  ],
  note: "Starting ideas to test with each team, not assumptions about how Cactus Club runs today. The first weeks would be spent at head office and in the restaurants learning how the work gets done.",
};

export const ccOffer = {
  eyebrow: "The arrangement",
  title: "Contract my company for the full scope of the role.",
  price: "$6,000",
  per: "a month",
  fine: "plus travel expenses",
  compare: "$72,000 a year, against the $100,000 to $125,000 range posted",
  body: "Unhired takes on everything in the posting: finding the work, building and shipping it, documenting it and supporting the staff who use it. No benefits, payroll contributions or onboarding cost on your side. I travel to head office and to any location whenever the work calls for it.",
  points: [
    { t: "Ongoing maintenance", b: "We maintain everything we build, so it keeps working as your systems and menus change." },
    { t: "On call at all times", b: "If something breaks during a Friday night service, my team picks it up." },
    { t: "A team behind the role", b: "Unhired specializes in building AI employees and automated workflows for businesses." },
  ],
};

export const ccCerts = [
  { k: "Claude Academy", v: "All 29 courses, certified" },
  { k: "OpenAI Academy", v: "All 8 courses" },
  { k: "Make Academy", v: "All 3 levels, Credly certified" },
  { k: "Microsoft", v: "Microsoft Copilot certification" },
  { k: "Zapier", v: "Zapier certification" },
];

export const ccTools = [
  "Anthropic API", "OpenAI API", "Claude Code", "AI agents", "TypeScript / JavaScript", "Next.js", "Supabase / Postgres", "Webhooks",
  "REST APIs", "n8n", "Make", "Zapier", "Power Automate", "Python", "Snowflake", "Sigma", "Google AI APIs", "Codex", "Microsoft Copilot", "Prompt engineering",
];

export const ccFinal = {
  title: "Let's",
  highlight: "talk.",
  sub: "If this arrangement is worth a conversation, I'd welcome 30 minutes with you or the IT team.",
};
