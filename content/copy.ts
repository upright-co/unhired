/**
 * All marketing copy for the home page.
 * Anything wrapped in [BRACKETS] is a placeholder to replace with real, sourced info.
 */

export const nav = {
  links: [
    { label: "What's an AI employee", href: "#what-is" },
    { label: "The solution", href: "#solution" },
    { label: "Human vs AI", href: "#compare" },
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: "Take Assessment",
};

export const hero = {
  headlineBefore: "Let",
  headlineHighlight: "AI",
  headlineAfter: "Be Your Next Hire",
  sub: "Take the assessment and discover if AI can replace the role that you're looking to hire for.",
  primaryCta: "Take Assessment",
  /** Roles that cycle through the hero carousel. Only the title is shown. */
  postings: [
    { title: "Data Analyst" },
    { title: "Receptionist" },
    { title: "Bookkeeper" },
    { title: "Executive Assistant" },
    { title: "Customer Support Rep" },
    { title: "Marketing Coordinator" },
    { title: "Dispatcher" },
    { title: "Operations Coordinator" },
    { title: "Inside Sales Rep" },
    { title: "Office Administrator" },
  ],
};

export const whatIsAiEmployee = {
  title: "What's an AI employee?",
  body: [
    "An AI employee is trained to hold a specific position. It has a role, a set of responsibilities, the tools to do the work, and knowledge of how your business actually runs. It knows who it is, where it fits on your team, and what it's accountable for.",
  ],
  /** Labels on the diagram. */
  diagram: {
    center: "Your AI hire",
    centerSub: "AI Receptionist",
    nodes: [
      { icon: "badge", label: "A role", detail: "A named position on your team, not a chat window" },
      { icon: "clipboard", label: "Responsibilities", detail: "The tasks it owns, start to finish" },
      { icon: "plug", label: "Tools", detail: "Phone, inbox, calendar, CRM — the same ones your team uses" },
      { icon: "book", label: "Knowledge", detail: "Your services, pricing, process and how you talk to customers" },
      { icon: "shield", label: "Accountability", detail: "Clear rules, human review on high-stakes calls, every action logged" },
    ],
  },
};

export const problem = {
  eyebrow: "The problem",
  title: "The problem with hiring a human.",
  sub: "Your people aren't the problem. Hiring is. Especially for roles that are mostly phones, inboxes and software.",
  tagline: "Unhire the role, not the person.",
  items: [
    {
      icon: "search",
      title: "Hiring takes months",
      body: "Write the post, pay the boards, screen the résumés, run the interviews. The phone keeps ringing the whole time.",
    },
    {
      icon: "graduation",
      title: "Then they need training",
      body: "A new hire isn't productive on day one, and the person training them isn't doing their own job either.",
    },
    {
      icon: "refresh",
      title: "And they leave",
      body: "When someone quits, everything you taught them walks out the door and you start the whole cycle again.",
    },
    {
      icon: "calendar-x",
      title: "Sick days and vacation",
      body: "Everyone needs time off. Nobody covers the desk, or you pay someone overtime to.",
    },
    {
      icon: "clock",
      title: "They work 9 to 5",
      body: "Your customers don't. The lead that comes in at 9pm on a Saturday goes to whoever answers first.",
    },
    {
      icon: "alert",
      title: "Busy days mean mistakes",
      body: "Missed callbacks, forgotten follow-ups, a CRM nobody updated. Not negligence, just being human on a bad day.",
    },
    {
      icon: "receipt",
      title: "The wage is only part of it",
      body: "Payroll taxes, benefits, insurance, equipment, software seats and desk space all sit on top of the salary.",
    },
    {
      icon: "users",
      title: "Someone has to manage them",
      body: "Scheduling, check-ins, reviews, corrections. Every hire takes a bite out of someone else's week.",
    },
  ],
};

export const solution = {
  eyebrow: "The solution",
  title: "Hire AI instead.",
  sub: "Same work, none of the overhead. An AI employee starts fast, works constantly and does the job the same way every time.",
  items: [
    {
      icon: "clock",
      title: "Works 24/7, 365",
      body: "Nights, weekends, holidays and the middle of your busy season. Every call answered, every lead followed up.",
    },
    {
      icon: "rocket",
      title: "On shift in days",
      body: "No job posting, no interviews, no notice period. We build it, train it on your business and turn it on.",
    },
    {
      icon: "target",
      title: "Does it the same way every time",
      body: "Your intake questions, your script, your process. It doesn't cut corners when it gets busy.",
    },
    {
      icon: "receipt",
      title: "No payroll taxes or benefits",
      body: "No insurance, no vacation pay, no equipment, no desk. One price to build the role.",
    },
    {
      icon: "layers",
      title: "Handles everything at once",
      body: "Five calls at the same time is the same as one. It doesn't get overwhelmed and it never puts anyone on hold.",
    },
    {
      icon: "refresh",
      title: "It doesn't quit",
      body: "Everything it knows stays documented. No turnover, no retraining, no starting over.",
    },
    {
      icon: "shield",
      title: "Every action is logged",
      body: "See exactly what it said and did, any time. High-stakes decisions route to a person first.",
    },
    {
      icon: "users",
      title: "Your team gets their week back",
      body: "The phones and the admin stop landing on whoever's closest, so your people do the work that needs a person.",
    },
  ],
};

export const comparison = {
  eyebrow: "Human hire vs. AI hire",
  title: "An honest side-by-side.",
  sub: "AI wins on availability, speed and consistency. People still win on relationships and anything in person. The best teams use both.",
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
      human: { verdict: "no", note: "Months to post, interview, hire and onboard" },
      ai: { verdict: "yes", note: "On shift in days" },
    },
    {
      label: "Training time",
      human: { verdict: "partial", note: "Weeks to months, and it costs your team's time too" },
      ai: { verdict: "yes", note: "Trained on your process before day one" },
    },
    {
      label: "Sick days and vacation",
      human: { verdict: "no", note: "Everyone needs time off, and the desk goes unmanned" },
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
      label: "What it costs",
      human: { verdict: "partial", note: "Salary + payroll taxes + benefits + equipment" },
      ai: { verdict: "yes", note: "From __PRICE__ to build the role" },
    },
    {
      label: "Relationship-building and in-person work",
      human: { verdict: "yes", note: "Humans win here: trust, site visits, hands-on work" },
      ai: { verdict: "partial", note: "Great first touch, but it hands off to your team" },
    },
  ] as const,
};

export const costChart = {
  eyebrow: "Run your own numbers",
  title: "What that gap looks like.",
  sub: "Set the wage you'd pay a person for this role. Everything below is base pay only — payroll taxes, benefits, equipment and recruiting sit on top of the human side.",
  sliderLabel: "Annual wage for this role",
  humanLabel: "Human hire",
  humanSub: "Base pay, first year",
  aiLabel: "AI hire",
  aiSub: "Starting price to build the role",
  footnote:
    "Your price depends on the scope of the role, the volume it handles and how many systems it connects to. The assessment tells you which parts of the job AI can take on.",
};

export const howItWorks = {
  eyebrow: "How it works",
  title: "From job post to AI hire in three steps.",
  steps: [
    {
      title: "Take the free AI Employee Assessment",
      body: "Tell us about the role you're hiring for. Upload the job post or describe it in your own words. Takes about three minutes.",
    },
    {
      title: "We email you your AI Opportunity Report",
      body: "A task-by-task breakdown of the role: what AI can handle on its own, what needs a human check, and what stays with your team.",
    },
    {
      title: "We build and train your AI employee for you",
      body: "Trained on your business, connected to your phone, inbox, calendar and CRM. On shift in days, not months.",
    },
  ],
  cta: "Take Assessment",
};

export const companiesSection = {
  eyebrow: "Our work",
  title: "Some of the companies we have built for.",
  sub: "Real businesses, real roles, now run by an AI employee.",
};

export const faqSection = {
  eyebrow: "FAQ",
  title: "Straight answers.",
};

export const finalCta = {
  title: "Your next hire is waiting.",
  sub: "Find out how much of the role AI can handle before you post the job.",
  cta: "Take Assessment",
};

export const footer = {
  description: "Unhired builds AI employees for growing businesses.",
  privacyLabel: "Privacy policy",
};
