/**
 * All marketing copy for the one-page site.
 * Anything wrapped in [BRACKETS] is a placeholder to replace with real, sourced info.
 */

export const nav = {
  links: [
    { label: "How it works", href: "#how-it-works" },
    { label: "What AI hires do", href: "#roles" },
    { label: "Human vs AI", href: "#compare" },
    { label: "Assessment", href: "#assessment" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: "Take the assessment",
};

export const hero = {
  pill: "Now staffing AI hires for trades & service businesses",
  headlineBefore: "Let your next hire be",
  headlineHighlight: "AI.",
  sub: "Before you post the job, see if AI can do it. We build AI employees that answer, book, follow up and handle the admin — trained on how your business runs.",
  primaryCta: "Can AI do this job?",
  secondaryCta: "See how it works",
  card: {
    label: "Your newest hire",
    role: "AI Receptionist",
    status: "On shift",
    feed: [
      { text: "Answered call from a new lead", time: "now" },
      { text: "Booked Thursday 10:00 AM", time: "2m" },
      { text: "Sent follow-up text", time: "5m" },
      { text: "Logged job details in CRM", time: "8m" },
      { text: "Replied to a 5-star review", time: "12m" },
      { text: "Confirmed tomorrow's 3 appointments", time: "15m" },
    ],
    stats: [
      { label: "Hours", value: "24/7" },
      { label: "Sick days", value: "0" },
      // "Salary" value comes from config.ts → pricing
    ],
  },
  jobPost: {
    title: "Hiring: Receptionist",
    lines: ["Full-time · On-site", "Answer phones, book jobs", "Must start ASAP"],
    stamp: "CLOSED",
  },
};

export const reframe = {
  eyebrow: "The reframe",
  title: "An AI agent is just an employee you don't have to hire.",
  wrongQuestion: "What can an AI agent do?",
  rightQuestion: "What does this employee do all day?",
  body: [
    "Everyone's asking what AI agents can do. It's the wrong question. It leads to demos, gadgets and tools nobody on your team has time to set up.",
    "Ask what the person in the role actually does all day. If most of it is answering, booking, following up, organizing, writing, reporting or updating systems, an AI hire can do it.",
  ],
  verbs: [
    "Answering",
    "Booking",
    "Following up",
    "Organizing",
    "Writing",
    "Reporting",
    "Updating systems",
  ],
};

export const hiddenCosts = {
  eyebrow: "The real cost of a human hire",
  title: "The salary is only the part you see.",
  sub: "Your people aren't the problem. Hiring is slow, expensive and fragile, especially for roles that are mostly phones, inboxes and software.",
  tagline: "Unhire the role, not the person.",
  items: [
    {
      icon: "search",
      title: "Recruiting time and job boards",
      body: "Writing the post, paying the boards, screening résumés, interviewing. Weeks of owner time before anyone starts.",
      stat: "[STAT — source needed: average time-to-hire / cost-per-hire]",
    },
    {
      icon: "graduation",
      title: "Onboarding and ramp-up",
      body: "New hires need training and time before they're fully productive, and someone on your team has to teach them.",
      stat: "[STAT — source needed: typical ramp-up time]",
    },
    {
      icon: "refresh",
      title: "Turnover and starting over",
      body: "When someone leaves, the knowledge walks out with them and you're back to the job post.",
      stat: "[STAT — source needed: cost of replacing an employee]",
    },
    {
      icon: "calendar-x",
      title: "Sick days, vacation and coverage gaps",
      body: "Everyone needs time off. The phone still rings while they're out.",
      stat: null,
    },
    {
      icon: "clock",
      title: "Limited hours",
      body: "Your office runs 9 to 5. Leads come in at 9 pm, on weekends and while you're on a job site.",
      stat: "[STAT — source needed: share of leads / calls after hours]",
    },
    {
      icon: "alert",
      title: "Inconsistency and human error",
      body: "Busy days mean missed callbacks, forgotten follow-ups and a CRM that's always out of date.",
      stat: null,
    },
    {
      icon: "receipt",
      title: "Payroll taxes, benefits and overhead",
      body: "Employer taxes, benefits, equipment, software seats and workspace all add up on top of the wage.",
      stat: "[STAT — source needed: total cost of employment vs. base salary]",
    },
    {
      icon: "users",
      title: "Management time",
      body: "Scheduling, check-ins, reviews and fixing mistakes. Every hire adds to someone's plate.",
      stat: null,
    },
  ],
};

export const rolesSection = {
  eyebrow: "What AI hires do",
  title: "Roles we staff with AI.",
  sub: "Each AI hire is trained on your business, connected to your tools and works the way you'd train a person to.",
  linkLabel: "Unhire this role",
  notListed:
    "Don't see your role? Take the assessment. If it involves a computer, a phone or a process, there's a good chance AI can do most of it.",
};

export const comparison = {
  eyebrow: "Human hire vs. AI hire",
  title: "An honest side-by-side.",
  sub: "AI hires win on availability, speed and consistency. People still win on relationships and anything in person. The best teams use both.",
  columns: { human: "Human hire", ai: "AI hire" },
  // verdict: "yes" = check, "no" = x, "partial" = tilde
  rows: [
    {
      label: "Available 24/7",
      human: { verdict: "no", note: "Business hours, plus overtime if you pay for it" },
      ai: { verdict: "yes", note: "Nights, weekends and holidays" },
    },
    {
      label: "Time to start",
      human: { verdict: "no", note: "Weeks to recruit and hire [STAT — source needed]" },
      ai: { verdict: "yes", note: "On shift in days" },
    },
    {
      label: "Training time",
      human: { verdict: "partial", note: "Weeks to months to fully ramp up" },
      ai: { verdict: "yes", note: "Trained on your docs, scripts and process before day one" },
    },
    {
      label: "Sick days",
      human: { verdict: "no", note: "Everyone needs time off" },
      ai: { verdict: "yes", note: "Zero" },
    },
    {
      label: "Turnover risk",
      human: { verdict: "no", note: "People move on, and the training goes with them" },
      ai: { verdict: "yes", note: "Doesn't quit. Knowledge stays documented." },
    },
    {
      label: "Handles unlimited volume at once",
      human: { verdict: "no", note: "One call at a time" },
      ai: { verdict: "yes", note: "Many calls, texts and emails at once" },
    },
    {
      label: "Follows your process exactly every time",
      human: { verdict: "partial", note: "Usually, when it isn't too busy" },
      ai: { verdict: "yes", note: "Same script and steps every time, with a full log" },
    },
    {
      label: "Monthly cost",
      human: { verdict: "partial", note: "Salary + taxes + benefits + overhead" },
      ai: { verdict: "yes", note: "__PRICE__/mo, no taxes or benefits" },
    },
    {
      label: "Relationship-building and in-person work",
      human: { verdict: "yes", note: "Humans win here: trust, site visits, hands-on work" },
      ai: { verdict: "partial", note: "Great first touch, but it hands off to your team" },
    },
  ] as const,
};

export const howItWorks = {
  eyebrow: "How it works",
  title: "From job post to AI hire in three steps.",
  steps: [
    {
      title: "Take the AI Hire Assessment.",
      body: "Tell us about the role. Upload your job post or describe it.",
    },
    {
      title: "Get your AI Employee Opportunity Report.",
      body: "See exactly which parts of the job AI can take over, and what stays with your team.",
    },
    {
      title: "We build and onboard your AI hire.",
      body: "Trained on your business, connected to your tools, on shift in days.",
    },
  ],
};

export const assessmentSection = {
  eyebrow: "The AI Hire Assessment",
  title: "Can AI do this job?",
  sub: "Takes about 3 minutes. Get a free report on how much of this role AI can handle.",
};

export const testimonialsSection = {
  eyebrow: "Results",
  title: "Roles already unhired.",
  sub: "[PLACEHOLDER — real customer results coming soon]",
};

export const faqSection = {
  eyebrow: "FAQ",
  title: "Straight answers.",
};

export const finalCta = {
  title: "Your next hire is waiting.",
  sub: "Find out how much of the role AI can handle before you post the job.",
  cta: "Take the assessment",
};

export const footer = {
  description: "Unhired builds AI employees for trade and service businesses.",
  privacyLabel: "Privacy policy",
};
