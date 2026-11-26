/**
 * unhired.io/contract: the generic landing page behind the QR code on Brandon's resume when he applies to
 * AI automation specialist roles. Video on top (script: brand/applications/contractor-video/script.md),
 * then everything a hiring manager would ask before taking a retainer instead of a hire.
 *
 * Voice: a company and a team ("we", "us", "our team"), never Brandon in the first person (Brandon, 2026-11-26).
 * Ownership and data-access lines confirmed by Brandon 2026-11-25. Term: the website says "cancel anytime"; the 30 days' notice
 * lives in the client agreement, never on this page (Brandon, 2026-11-25). Tool costs included, bi-weekly or monthly invoicing, custom code the
 * client owns and the client dashboard come from what he says in the video (edit: ~/Documents/unhired-daily-video/filmed/application).
 * Page rework 2026-11-26 (Brandon's 16 changes): new headline, "How we move faster" as audit, build, deploy, no probation/safety
 * section (it raised fear of mistakes), a data privacy section instead, a benefits grid instead of our own systems, tool logos,
 * and the booking calendar embedded at the bottom.
 */

const MEDIA = "https://qipricvcuppnnlzvixgn.supabase.co/storage/v1/object/public/site-media/applications/contract";

export const contractApp = {
  /** Leave empty to show the placeholder frame. */
  video: `${MEDIA}/application-video.mp4`,
  poster: `${MEDIA}/poster.jpg`,
  email: "brandon@getunhired.com",
  bookingUrl: "https://cal.com/brandon-upright/team-call",
  /** The same event type, embedded inline at the bottom of the page. */
  calLink: "brandon-upright/team-call",
  photo: "/email/brandon-headshot.png",
};

export const contractHero = {
  headlineBefore: "Your AI & Automation Team",
  headlineHighlight: "At Half The Cost",
  sub: "You get our entire team working for you, with our 5-year track record and hundreds of AI and automation builds behind us, at a fraction of the cost of an in-house salaried hire.",
  videoTitle: "Unhired: why contract our team for your AI and automation work",
  facts: [
    "5 years building AI systems for companies",
    "$3,000 a month for full support",
    "Month to month, cancel anytime",
    "Everything we build belongs to you",
  ],
};

export const contractCompare = {
  eyebrow: "A hire or a retainer",
  title: "What you get with each",
  cols: ["Full-time hire", "Unhired on retainer"],
  rows: [
    { k: "Before work starts", hire: "Weeks of recruiting and interviews, then onboarding", us: "One audit call with the people who do the work today" },
    { k: "Experience", hire: "Whatever one person has seen before, learning your business from scratch", us: "Hundreds of AI and automation builds, and a process we follow on every job" },
    { k: "Who does the work", hire: "One person, with one person's skills and hours", us: "Our whole team, with the skills of several hires" },
    { k: "When someone is away or leaves", hire: "The work stops, and what they know leaves with them", us: "Everything is documented, and the whole team knows your setup" },
    { k: "After launch", hire: "Depends on how much time they have left over", us: "Monitoring, a weekly review with you, and fixes when something breaks" },
    { k: "Cost", hire: "Salary, payroll taxes, benefits, equipment and ramp-up time", us: "A flat $3,000 a month, with the cost of running everything included" },
  ],
};

export const contractSpeed = {
  eyebrow: "How we move faster",
  title: "We've been doing this for businesses across the world, every day, for 5 years.",
  body: "Because of our extensive experience, we know how to move quickly and effectively to get your automations running in your business. We know what works, what doesn't, and what mistakes to avoid.",
  items: [
    {
      t: "Audit",
      h: "We know where to look",
      b: "One call with the people who do the work is enough for us to find the tasks that eat your team's week. We've run this audit many times, so we know which questions to ask and which processes will pay off first.",
    },
    {
      t: "Build",
      h: "Built right the first time",
      b: "We know which tools fit each job, how to connect them to the systems you already use, and where automations tend to break. We design around those problems from day one, so you aren't paying for trial and error.",
    },
    {
      t: "Deploy",
      h: "Live in your business, with your team on board",
      b: "We launch in stages, train your staff on the new way of working and watch everything closely in the first weeks. The time a new hire would spend learning, we spend delivering.",
    },
  ],
  tracks: [
    { label: "New hire", steps: ["Recruit", "Onboard", "Learn systems", "Pick tools", "First build"], tone: "muted" as const },
    { label: "Unhired", steps: ["Audit call", "Automation map", "Build", "Live"], tone: "signal" as const },
  ],
  trackNote: "Illustration: steps, not a timeline. How long each one takes depends on the work.",
  raceDone: "Your automations are live while a new hire is still learning your systems.",
};

export const contractSteps = {
  eyebrow: "How it works",
  title: "Six steps, the same on every engagement",
  steps: [
    { t: "Audit", b: "We talk to the people who do the work today and list every task that eats their week.", get: "A list of the work worth automating" },
    { t: "Map", b: "We map each process as it runs now, mark where time is lost, and draw it again with AI in it.", get: "Before and after process maps, with what each one saves" },
    { t: "Build", b: "We build the workflows and AI Employees around the tools you already use. Most of it is custom code, so you aren't paying for a stack of automation subscriptions.", get: "Working automations that you own, connected to your systems" },
    { t: "Train", b: "Each AI Employee learns your rules, your tone and your exceptions from real examples your team approves.", get: "An AI Employee that does the task your way" },
    { t: "Launch", b: "It goes live in your business, with your team trained on how to work alongside it.", get: "Real work done, in your systems" },
    { t: "Maintain", b: "We monitor everything, review it with you every week and fix what breaks as your systems change.", get: "A weekly review, your own dashboard and a team on call" },
  ],
};

/** Replaced the probation/approvals section (Brandon, 2026-11-26). Every line here must stay true of how we work. */
export const contractPrivacy = {
  eyebrow: "Your data",
  title: "Your data stays private and secure.",
  body: "All of your data remains safe, secure and 100% yours. We build on top of your systems instead of moving your information into ours, and you control every door we use to get in.",
  points: [
    { icon: "database", t: "It stays in your systems", b: "Your customer and business data lives in your own accounts and databases. We connect to it where it is, and we don't keep copies." },
    { icon: "key", t: "Access you control", b: "We connect through accounts and API keys set up in your company's name, each with only the permissions its task needs. You can switch any of them off at any time." },
    { icon: "lock", t: "Encrypted in transit and at rest", b: "Every connection runs over TLS, and the databases and platforms we build on encrypt the data they store." },
    { icon: "brain", t: "Never used to train AI models", b: "We build on the Anthropic and OpenAI APIs, which don't use API data to train their models by default." },
    { icon: "eye", t: "Every action is logged", b: "Each task an AI Employee completes is recorded, so you can see exactly what it did and when, in your own private dashboard." },
    { icon: "file", t: "100% yours", b: "The code, workflows, prompts and accounts belong to your company. If you ever end the retainer, everything stays with you, documented." },
  ],
};

/** "What you get when you hire us": replaced the list of our own systems (Brandon, 2026-11-26). */
export const contractBenefits = {
  eyebrow: "Benefits and deliverables",
  title: "What you get when you hire us",
  items: [
    { icon: "users", t: "A whole team, not one hire", b: "Our team works on your account, so you get more skills than one person can bring." },
    { icon: "search", t: "An automation audit", b: "Every task worth automating, ranked by the time it gives back to your team." },
    { icon: "map", t: "Before and after process maps", b: "Each process drawn as it runs today and redrawn with AI in it, with what it saves." },
    { icon: "code", t: "Custom builds you own", b: "Workflows, integrations and AI Employees built around the tools you already use." },
    { icon: "bot", t: "AI Employees trained your way", b: "They learn your rules, your tone and your exceptions from real examples your team approves." },
    { icon: "wallet", t: "Running costs included", b: "The AI usage, tools and hosting behind what we build are on us." },
    { icon: "activity", t: "Monitoring and fixes", b: "We watch everything that's live and fix what breaks as your systems change." },
    { icon: "calendar", t: "A weekly review", b: "Thirty minutes a week on what ran, what we found and what we take on next." },
    { icon: "chart", t: "Your own dashboard", b: "See the work each AI Employee did and the time it saved, whenever you like." },
    { icon: "book", t: "Documentation and training", b: "Every build written up step by step, and your staff trained to use it." },
    { icon: "receipt", t: "No recruiting or payroll", b: "One invoice, bi-weekly or monthly. No hiring, benefits or payroll taxes." },
    { icon: "refresh", t: "Month to month", b: "No long-term commitment. Cancel anytime." },
  ],
};

/** Logos are drawn from src/components/contract/toolLogos.ts (Simple Icons paths and brand colours). */
export const contractTools = {
  label: "Tools we build with",
  tools: ["anthropic", "openai", "claude", "googlegemini", "n8n", "make", "zapier", "powerautomate", "python", "typescript", "nextdotjs", "supabase", "postgresql", "snowflake"] as const,
  certsLabel: "Our certifications",
  certs: [
    "All 29 Claude Academy courses",
    "All 8 OpenAI Academy courses",
    "All 3 Make Academy levels",
    "Zapier and Microsoft Copilot certified",
  ],
  people: "We work with clients in the United Kingdom, Australia, the United States and Canada. Our founder, Brandon Upright, has also taught more than 5,000 people to use AI through an online community, courses and short-form video.",
};

/**
 * Client testimonials. The first three come from the pilot intro PDF (brand/proposals/pilot-overview), with town names
 * dropped because this page goes to companies across the US and Canada; the last three Brandon supplied 2026-11-26.
 * Quotes are the clients' own words: don't edit them beyond punctuation.
 */
export const contractTestimonials = {
  eyebrow: "In our clients' words",
  title: "What our clients say",
  items: [
    { stat: "$15M", label: "in pipeline found", quote: "The AI lead-generation system that they built for us has identified $15 million in pipeline opportunity that we otherwise wouldn't have known about.", name: "Jarome L", company: "", photo: "/contract/testimonials/jarome-l.jpg" },
    { stat: "2-3", label: "hires avoided", quote: "Working with Brandon and his team has been the biggest kickstart in productivity that our team has ever experienced. His team was able to quickly identify where we need to add AI into our day-to-day systems, and what specific parts of the processes could be automated. Their implementations saved us from having to hire an additional 2-3 people to keep up with the workload.", name: "Camilla R", company: "", photo: "/contract/testimonials/camilla-r.jpg" },
    { stat: "15 hrs", label: "saved every week", quote: "I would estimate that our team saves about 15 hours per week across our different roles, thanks to AI and automations that Unhired implemented in our business.", name: "Charlie F", company: "" },
    { stat: "10+ hrs", label: "saved every week", quote: "Brandon and his team built us our own AI employee to assist our marketing team with our day-to-day operations, as well as a custom dashboard to go with it. Our team now saves at least 10 hours per week across our marketing and sales department, thanks to the AI.", name: "Anthony M", company: "Premier Built Garages" },
    { stat: "2x", label: "sales conversions", quote: "Our AI Employee helps monitor all of our conversations with our leads to spot opportunities and potential gaps. It helps us prioritize who to focus on and what action steps to take next. Now nothing slips through the cracks. Our sales conversions have doubled in the last 60 days thanks to our AI.", name: "Ana U", company: "" },
    { stat: "2", label: "AI employees, team kept small", quote: "Working with Brandon and his team has been a dream come true for our business. We now have 2 different AI employees that allowed us to keep our team small, and also relieve the pressure off of many of our staff members. AI employees are the future of work, and Brandon makes it very simple to get them up and running in your business.", name: "Keller P", company: "" },
  ],
};

/** Price set by Brandon 2026-11-25: $3,000 a month flat for full support, month to month, running costs included, AI media output extra. */
export const contractPrice = {
  price: "$3,000",
  per: "per month",
  terms: ["Full-time support", "Month-to-month (cancel anytime)"],
  compare: "That's $36,000 a year. Compare it with the salary in your posting, before payroll taxes and benefits.",
  title: "One flat fee. No contract.",
  included: [
    { t: "Everything in your posting", b: "Finding the work, building it, documenting it and training your staff." },
    { t: "Running costs covered", b: "The AI usage, tools and infrastructure behind what we build are on us." },
    { t: "Monitoring and fixes", b: "We watch everything that's live, and our team is on call when something breaks." },
    { t: "A weekly review and your own dashboard", b: "See what each AI Employee did, and decide what we take on next." },
    { t: "Invoiced your way", b: "Bi-weekly or monthly, whichever fits your labour budget." },
  ],
  smallPrint: "AI-generated media, such as images and videos, is not included in the retainer and is charged separately.",
};

/**
 * Animated cost comparison under the price (Brandon, 2026-11-26), drawn to scale like the video's cost scene.
 * Default salary: median posted pay for US AI automation roles, Indeed pull of 2026-11-20 (research/ai-automation-jobs-2026-11-20.csv,
 * 455 postings with pay). Costs on top of the salary: BLS Employer Costs for Employee Compensation, June 2026 (released 2026-09-09),
 * table 5, full-time private industry, professional and related occupations, per hour worked: wages $52.92, paid leave $7.52,
 * supplemental pay $3.21, insurance $6.17, retirement $3.02, legally required $4.96. A posted salary already includes paid leave,
 * so each share below is that cost divided by wages + paid leave ($60.44), and paid leave is shown inside the salary block.
 */
export const contractCost = {
  eyebrow: "The real cost of a hire",
  title: "A salary is only part of what a hire costs.",
  body: "On top of the salary, an employer pays for bonuses, insurance, retirement and payroll taxes, and keeps paying while the person is on vacation. Move the slider to the salary in your posting.",
  sliderLabel: "Salary in your posting",
  defaultSalary: 130_000,
  min: 50_000,
  max: 200_000,
  step: 5_000,
  retainerYear: 36_000,
  paidLeaveShare: 7.52 / 60.44,
  extras: [
    { key: "taxes", label: "Payroll taxes and required insurance", share: 4.96 / 60.44, color: "#F65663" },
    { key: "insurance", label: "Health and other insurance", share: 6.17 / 60.44, color: "#F87A84" },
    { key: "retirement", label: "Retirement contributions", share: 3.02 / 60.44, color: "#FA9DA4" },
    { key: "bonus", label: "Bonuses and other extra pay", share: 3.21 / 60.44, color: "#FCC0C4" },
  ],
  hireLabel: "Full-time hire",
  usLabel: "Unhired",
  usNote: "$3,000 a month, running costs included",
  sources:
    "Costs on top of the salary: U.S. Bureau of Labor Statistics, Employer Costs for Employee Compensation, June 2026 (full-time private industry, professional occupations). Starting salary: median posted pay for AI automation roles in the US on Indeed, November 2026. Recruiting, training and equipment are not counted.",
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
    { q: "What do you need from our team?", a: "An hour for the audit call with the people who do the work, someone to check the first results with us as each automation goes live, and 30 minutes a week for the review." },
    { q: "What happens when something breaks?", a: "We monitor everything that's live, so we usually catch a failure before anyone notices. Our team fixes it, and you see what happened in the weekly review." },
    { q: "How soon can you start?", a: "As soon as you'd like. Book a call below, and the audit call can be the next step." },
  ],
};

export const contractFinal = {
  lead: "Next Step:",
  title: "Book a Call",
  highlight: "With Brandon",
  sub: "Get all of your questions answered and learn how to proceed with hiring our team.",
};
