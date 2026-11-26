/**
 * unhired.io/contract: the generic landing page behind the QR code on Brandon's resume when he applies to
 * AI automation specialist roles. Video on top (script: brand/applications/contractor-video/script.md),
 * then everything a hiring manager would ask before taking a retainer instead of a hire.
 * Keep it in step with the video script.
 *
 * Ownership and data-access lines confirmed by Brandon 2026-11-25. Term: the website says "cancel anytime"; the 30 days' notice
 * lives in the client agreement, never on this page (Brandon, 2026-11-25). Tool costs included, bi-weekly or monthly invoicing, custom code the
 * client owns and the client dashboard come from what he says in the video (edit: ~/Documents/unhired-daily-video/filmed/application).
 */

const MEDIA = "https://qipricvcuppnnlzvixgn.supabase.co/storage/v1/object/public/site-media/applications/contract";

export const contractApp = {
  /** Leave empty to show the placeholder frame. */
  video: `${MEDIA}/application-video.mp4`,
  poster: `${MEDIA}/poster.jpg`,
  email: "brandon@getunhired.com",
  bookingUrl: "https://cal.com/brandon-upright/demo-call",
  photo: "/email/brandon-headshot.png",
};

export const contractHero = {
  kicker: "For companies hiring an AI automation specialist",
  headlineBefore: "Give the role to a team,",
  headlineHighlight: "on a monthly retainer.",
  sub: "I'm Brandon Upright, founder of Unhired. This five-minute video explains why contracting my company will get your AI and automation work done sooner, for a flat $3,000 a month. Everything else you'd want to know is written out below it.",
  videoTitle: "Brandon Upright: why contract Unhired for your AI automation role",
  facts: [
    "5 years building AI systems for companies",
    "$3,000 a month for full support",
    "Month to month, no contract",
    "Everything we build belongs to you",
  ],
};

export const contractCompare = {
  eyebrow: "A hire or a retainer",
  title: "What you get with each",
  cols: ["Full-time hire", "Unhired on retainer"],
  rows: [
    { k: "Before work starts", hire: "Weeks of recruiting and interviews, then onboarding", us: "An audit call with the people who do the work today" },
    { k: "Starting point", hire: "A blank page: pick tools, write the first prompts, learn what breaks", us: "A tested process and library of workflows from our client work" },
    { k: "Who does the work", hire: "One person, with one person's skills and hours", us: "Our team, plus our own internal AI Employees" },
    { k: "When someone is away or leaves", hire: "The work stops, and what they know leaves with them", us: "Everything is documented, and the whole team knows your setup" },
    { k: "After launch", hire: "Depends on how much time they have left over", us: "Monitoring, a weekly review with you, and fixes when something breaks" },
    { k: "Cost", hire: "Salary, payroll taxes, benefits, equipment and ramp-up time", us: "A flat $3,000 a month, with the cost of running everything included" },
  ],
};

export const contractSpeed = {
  eyebrow: "Why we move faster",
  title: "Most of the work a new hire would start with, we've already done.",
  body: "Every client we've built for has added to how we work. That gives you three things a new hire can't bring on day one.",
  items: [
    {
      t: "A process we follow on every job",
      b: "We map how your team does the work, fix the process first and then build. The same steps, documents and checks on every engagement, so nothing gets skipped and you always know what stage we're at.",
    },
    {
      t: "A tested library",
      b: "Workflows, prompts, error handling and monitoring we've already built and run for other clients. We adapt what works to your systems instead of building each piece for the first time.",
    },
    {
      t: "Our own internal AI Employees",
      b: "They do the research, write first drafts, test builds and watch everything that's live. The people on our team spend their time on decisions about your business, and the routine work keeps moving overnight.",
    },
  ],
  tracks: [
    { label: "New hire", steps: ["Recruit", "Onboard", "Learn your systems", "Pick tools", "First build"], tone: "muted" as const },
    { label: "Unhired", steps: ["Audit call", "Your automation map", "Build", "Live"], tone: "signal" as const },
  ],
  trackNote: "Steps only, not a timeline. How long each one takes depends on the work.",
};

export const contractSteps = {
  eyebrow: "How it works",
  title: "Six steps, the same on every engagement",
  steps: [
    { t: "Audit", b: "We talk to the people who do the work today and list every task that eats their week.", get: "A list of the work worth automating" },
    { t: "Map", b: "We map each process as it runs now, mark where time is lost, and draw it again with AI in it.", get: "Before and after process maps, with what each one saves" },
    { t: "Build", b: "We build the workflows and AI Employees around the tools you already use. Most of it is custom code, so you aren't paying for a stack of automation subscriptions.", get: "Working automations that you own, connected to your systems" },
    { t: "Train", b: "Each AI Employee learns your rules, your tone and your exceptions from real examples your team approves.", get: "An AI Employee that does the task your way" },
    { t: "Launch", b: "It goes live on probation. It drafts the work and a person on your team approves it.", get: "Real work done, with a person signing off" },
    { t: "Maintain", b: "We monitor everything, review it with you every week and fix what breaks as your systems change.", get: "A weekly review, your own dashboard and a team on call" },
  ],
};

export const contractSafety = {
  eyebrow: "Control stays with your team",
  title: "Nothing runs on its own until it has earned it.",
  points: [
    { stat: "30", unit: "approvals", b: "in a row before an AI Employee can do a task without sign-off" },
    { stat: "95%", unit: "accuracy", b: "needed across those approvals, checked task by task" },
    { stat: "1", unit: "review a week", b: "with you, covering what ran, what was flagged and what's next" },
  ],
  body: "Every AI Employee starts on probation. It drafts and your team approves. It only moves up once it has hit the bar on that task, and anything it isn't sure about goes to a person. A monitoring agent watches everything that's live, and our team gets the alert when something fails.",
};

export const contractProof = {
  eyebrow: "We run our own company on what we build",
  title: "The same systems we'd build for you.",
  items: [
    { k: "Outbound engine", v: "Finds businesses that are hiring, scores each role with Claude, writes a personal email and sends about 450 a day, with every reply logged in a CRM." },
    { k: "Client portal", v: "Built in Next.js and Supabase. Each client sees only its own data: the AI Employee's work log, approvals, flagged items and savings." },
    { k: "AI Employee Assessment", v: "A Claude-powered survey that writes each business owner a personal report. Prompt changes are tested against a 10-scenario simulation before release." },
    { k: "CRM", v: "Fed by four lead sources through webhooks, including booking events and ad leads matched against the website pixel." },
  ],
  tools: [
    "Anthropic API", "OpenAI API", "Claude Code", "n8n", "Make", "Zapier", "Power Automate", "Microsoft Copilot",
    "Python", "TypeScript", "Next.js", "Supabase / Postgres", "REST APIs", "Webhooks", "Snowflake", "Google AI APIs",
  ],
  certs: [
    "All 29 Claude Academy courses",
    "All 8 OpenAI Academy courses",
    "All 3 Make Academy levels",
    "Zapier and Microsoft Copilot certified",
  ],
  people: "We work with clients in the United Kingdom, Australia, the United States and Canada. Brandon has also taught more than 5,000 people to use AI through an online community, courses and short-form video.",
};

/** Price set by Brandon 2026-11-25: $3,000 a month flat for full support, month to month, running costs included, AI media output extra. */
export const contractPrice = {
  eyebrow: "What it costs",
  price: "$3,000",
  per: "a month",
  fine: "for full support",
  compare: "That's $36,000 a year. Compare it with the salary in your posting, before payroll taxes and benefits.",
  title: "One flat fee. No contract.",
  body: "The retainer covers the full scope of the role you posted. It's month to month, you can cancel anytime, and we pay the entire cost of running your AI Employees and automations.",
  included: [
    { t: "Everything in your posting", b: "Finding the work, building it, documenting it and training your staff." },
    { t: "Running costs covered", b: "The AI usage, tools and infrastructure behind what we build are on us." },
    { t: "Monitoring and fixes", b: "We watch everything that's live, and our team is on call when something breaks." },
    { t: "A weekly review and your own dashboard", b: "See what each AI Employee did, and decide what we take on next." },
    { t: "Invoiced your way", b: "Bi-weekly or monthly, whichever fits your labour budget." },
  ],
  smallPrint: "AI-generated media, such as images and videos, is not included in the retainer and is charged separately.",
};

export const contractFaq = {
  eyebrow: "Questions",
  title: "What hiring managers ask us",
  items: [
   
    { q: "Who owns what you build?", a: "You do. Most of what we build is custom code, and it's yours. Workflows, prompts, code and accounts are set up in your company's name, and if you ever end the retainer, everything stays with you, documented." },
   
    { q: "Are we locked into a contract?", a: "No. It's month to month, and you can cancel anytime." },
    { q: "Is anything extra on top of the $3,000?", a: "We cover the entire cost of running your AI Employees and automations. The one exception is AI-generated media, such as images and videos, which is charged separately." },
    { q: "How do you invoice?", a: "Bi-weekly or monthly, whichever fits your labour budget." },
    { q: "Do you work on site?", a: "We work remotely and come on site when the work calls for it, like the audit or a training session with your team." },
    { q: "Will you work with our IT team and the tools we already have?", a: "Yes. We build in the tools you already pay for wherever we can, and we agree access and approvals with your IT team before we connect anything." },
   
    { q: "How do you handle our data?", a: "We get only the access each task needs, through accounts you control and can switch off at any time. Customer data stays in your systems." },
    { q: "What do you need from our team?", a: "An hour for the audit call with the people who do the work, someone to approve the AI Employee's drafts while it's on probation, and 30 minutes a week for the review." },
    { q: "What happens when something breaks?", a: "The monitoring agent catches most failures before anyone notices. Our team gets the alert and fixes it, and you see what happened in the weekly review." },
    { q: "How soon can you start?", a: "As soon as you'd like. Book a call below, and the audit call can be the next step." },
  ],
};

export const contractFinal = {
  title: "Let's",
  highlight: "talk.",
  sub: "Thirty minutes is enough to go through your posting and tell you plainly what we'd take on first.",
  cta: "Book a 30-minute call",
};
