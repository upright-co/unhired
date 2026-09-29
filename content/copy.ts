/**
 * All marketing copy for the home page.
 * The product term is "AI Employee" (capitalised) everywhere a visitor can see it.
 * Anything wrapped in [BRACKETS] is a placeholder to replace with real, sourced info.
 */

export const nav = {
  links: [
    { label: "What's an AI Employee", href: "#what-is" },
    { label: "The guarantee", href: "#guarantee" },
    { label: "Human vs AI", href: "#compare" },
    { label: "How it works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  cta: "Take Assessment",
};

export const hero = {
  headlineBefore: "Your next hire is an",
  headlineHighlight: "AI Employee",
  headlineAfter: ".",
  sub: "Tell us the role you're about to post. We build, train and fully maintain an AI Employee that does the job, and we guarantee it costs at least 50% less than the salary.",
  primaryCta: "Take Assessment",
  /** Short promises shown under the CTA. */
  promises: ["We build it", "We train it", "We maintain it", "50% salary savings, guaranteed"],
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
  eyebrow: "Start here",
  title: "What's an AI Employee?",
  body: [
    "An AI Employee is built to hold one specific position on your team. It has a job title, a set of responsibilities, the tools to do the work, and knowledge of how your business actually runs. It knows who it is, where it fits, and what it's accountable for.",
    "That's the difference from a chatbot. A chatbot waits for questions. An AI Employee owns the role you were about to hire for: it answers the phone when it rings, books the appointment, updates the CRM, and follows up on Thursday if nobody called back.",
  ],
  /** Labels on the radial diagram. */
  diagram: {
    center: "Your AI Employee",
    centerSub: "AI Receptionist",
    status: "On shift",
    nodes: [
      { icon: "badge", label: "A role", detail: "A named position on your team, not a chat window" },
      { icon: "clipboard", label: "Responsibilities", detail: "The tasks it owns, start to finish" },
      { icon: "plug", label: "Tools", detail: "Phone, inbox, calendar, CRM. The same ones your team uses" },
      { icon: "book", label: "Knowledge", detail: "Your services, pricing, process and how you talk to customers" },
      { icon: "shield", label: "Accountability", detail: "Clear rules, a person reviews high-stakes calls, every action logged" },
    ],
  },
};

export const problem = {
  eyebrow: "The problem",
  title: "The problem with hiring a human.",
  sub: "Your people aren't the problem. Hiring is. Especially for roles that are mostly phones, inboxes and software.",
  tagline: "Unhire the role, not the person.",
  /** The hiring journey, drawn as a timeline. */
  timeline: [
    { when: "Day 1", title: "Write the post, pay the boards", body: "The phone starts ringing unanswered the same day." },
    { when: "Weeks 2 to 4", title: "Screen résumés, run interviews", body: "Evenings and weekends, on top of your actual job." },
    { when: "Weeks 6 to 8", title: "Offer, notice period, start date", body: "The best candidate has two other offers." },
    { when: "Months 2 to 3", title: "Training", body: "A new hire isn't productive on day one, and the person training them isn't doing their own job either." },
    { when: "Month 12 and on", title: "They leave", body: "Everything you taught them walks out the door, and you start the whole cycle again." },
  ],
  /** What sits on top of the wage, drawn as a rising stack. */
  costStack: {
    title: "The wage is only the bottom of the stack",
    items: [
      "Salary",
      "Payroll taxes",
      "Benefits and insurance",
      "Equipment and software seats",
      "Recruiting and job boards",
      "Sick days, vacation and overtime cover",
      "Someone's time to manage them",
    ],
  },
};

export const solution = {
  eyebrow: "The solution",
  title: "Meet your AI Employee.",
  sub: "Same work, none of the overhead. It starts in days, works around the clock, and does the job the same way every time.",
  /** A day on shift, drawn as a 24-hour log. Times are examples. */
  shiftTitle: "One shift, no breaks",
  shift: [
    { time: "6:12 am", event: "Books a 9:30 appointment from an overnight web form and sends the confirmation" },
    { time: "8:45 am", event: "Answers four calls at once. Nobody hears hold music" },
    { time: "11:20 am", event: "Chases three open estimates from last week, logs every reply in the CRM" },
    { time: "2:05 pm", event: "Pulls an insurance breakdown and files the pre-authorization" },
    { time: "5:58 pm", event: "Takes the after-hours emergency call and dispatches the on-call tech" },
    { time: "9:40 pm", event: "Replies to a Saturday lead in under a minute. The competitor replies Monday" },
    { time: "11:59 pm", event: "Hands you a log of everything it did today. Then keeps going" },
  ],
  benefits: [
    "Works 24/7, 365. Nights, weekends, holidays and your busy season.",
    "On shift in days. No job posting, no interviews, no notice period.",
    "Follows your process exactly, every time. It doesn't cut corners when it gets busy.",
    "Handles unlimited volume at once. Five calls is the same as one.",
    "It doesn't quit. Everything it knows stays documented.",
    "Every action is logged, and high-stakes decisions go to a person first.",
    "No payroll taxes, benefits, equipment or desk.",
    "Your team gets their week back for the work that needs a human.",
  ],
};

export const guarantee = {
  eyebrow: "The guarantee",
  percent: 50,
  title: "Save at least 50% of the salary. Guaranteed.",
  sub: "Whatever the role pays, your AI Employee costs at least half less than that salary. Most come in well under. If we can't guarantee it for your role, we'll tell you before you spend a dollar.",
  chartLabels: { human: "What the role pays a person", ai: "Your maximum with the guarantee", saved: "Yours to keep, every year" },
  promisesTitle: "You never have to touch the AI.",
  promises: [
    {
      icon: "rocket",
      title: "We build it",
      body: "Designed around the job description you were about to post, connected to your phone, inbox, calendar and CRM.",
    },
    {
      icon: "graduation",
      title: "We train it",
      body: "On your services, your pricing, your process and how you talk to customers. It shows up knowing the job.",
    },
    {
      icon: "shield",
      title: "We maintain it",
      body: "We watch it, fix it, and improve it as your business changes. Nothing technical ever lands on your desk.",
    },
  ],
};

export const comparison = {
  eyebrow: "Human hire vs. AI Employee",
  title: "An honest side-by-side.",
  sub: "AI wins on availability, speed and consistency. People still win on relationships and anything in person. The best teams use both.",
  columns: { human: "Human hire", ai: "AI Employee" },
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
      ai: { verdict: "yes", note: "Trained on your process before day one, by us" },
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
      human: { verdict: "partial", note: "Salary + payroll taxes + benefits + equipment + recruiting" },
      ai: { verdict: "yes", note: "At least 50% less than the salary, guaranteed" },
    },
    {
      label: "Who keeps it running",
      human: { verdict: "partial", note: "You: scheduling, reviews, corrections, coverage" },
      ai: { verdict: "yes", note: "We do. Built, trained and maintained by Unhired" },
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
  title: "What the guarantee means for your role.",
  sub: "Set the salary you'd pay a person for this position. The guarantee caps what your AI Employee can cost at half of it, and the rest is yours to keep every year.",
  sliderLabel: "Annual salary for this role",
  humanLabel: "Human hire",
  humanSub: "Base salary, before taxes, benefits and overhead",
  aiLabel: "AI Employee",
  aiSub: "Guaranteed maximum. Most come in well under.",
  savedLabel: "You keep at least",
  footnote:
    "The exact figure depends on the scope of the role, the volume it handles and how many systems we connect. The assessment tells you which parts of the job AI can take on.",
};

export const howItWorks = {
  eyebrow: "How it works",
  title: "From job post to AI Employee in three steps.",
  steps: [
    {
      title: "Take the free AI Employee Assessment",
      body: "Tell us about the role you're hiring for. Upload the job post or describe it in your own words. Takes about three minutes.",
    },
    {
      title: "We email you your AI Opportunity Report",
      body: "A task-by-task breakdown of the role: what your AI Employee handles on its own, what needs a human check, and what stays with your team.",
    },
    {
      title: "We build, train and maintain your AI Employee",
      body: "Connected to your phone, inbox, calendar and CRM, trained on your business, and looked after by us from then on. You never have to learn a thing about AI.",
    },
  ],
  cta: "Take Assessment",
};

export const companiesSection = {
  eyebrow: "Our work",
  title: "Some of the companies we have built for.",
  sub: "Real businesses, real roles, now run by an AI Employee.",
};

export const faqSection = {
  eyebrow: "FAQ",
  title: "Straight answers.",
};

export const finalCta = {
  title: "Your next hire is an AI Employee.",
  sub: "Find out how much of the role it can handle, and what you'd save, before you post the job.",
  cta: "Take Assessment",
};

export const footer = {
  description: "Unhired builds, trains and maintains AI Employees for growing businesses.",
  privacyLabel: "Privacy policy",
};
