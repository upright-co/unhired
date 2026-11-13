/**
 * Copy for the Edmonton pilot VSL page (/pilot) and its questionnaire (/pilot/apply).
 * Every section exists to move the reader to the Apply button. Edit words here, not in components.
 * Run `node scripts/check-writing.mjs content/pilot.ts` after changes (place-name and
 * "selling" errors are article rules and don't apply to this sales page).
 */

export const pilotHero = {
  kicker: "Edmonton business owners",
  headlineBefore: "I'm choosing 5 Edmonton businesses to transform with",
  headlineHighlight: "AI",
  headlineAfter: ", completely free.",
  sub: "I will come to your business in person, sit down with you and your team and find all of the work that AI can take off of their plate. Then I will build you your first AI Employee and install it into your business for free.",
  cta: "Apply for a spot",
  ctaNote: "Only 5 spots available.",
  videoTitle: "A message from Brandon",
  videoPlaceholder: "Video coming soon",
};

export const pilotProof = [
  "In-person visit at your business",
  "An AI Employee built for you",
  "Your AI Opportunity Map to keep",
  "30 days running in your business, completely free",
];

export const pilotSteps = {
  eyebrow: "If you're picked",
  title: "What the next 30 days look like",
  sub: "You give me a few hours at the start and an hour at the end. I do the rest.",
  steps: [
    {
      when: "Week 1 · At your business",
      title: "The visit",
      body: "A few hours on site. I interview you and the people who do the work: whoever answers the phone, books the appointments, chases the invoices and keeps the paperwork moving. I want to see a normal day, not a tidy version of it.",
    },
    {
      when: "Two days later",
      title: "Your AI Opportunity Map",
      body: "Every task I heard about, the hours it eats each week and whether an AI Employee can do it, needs a person to sign off, or should stay human. It's yours to keep whether we work together or not.",
    },
    {
      when: "Week 2",
      title: "The build",
      body: "I take the task that frees up the most hours and build an AI Employee for it, connected to the phone line, inbox, calendar or software you already use. Nobody on your team learns a new tool.",
    },
    {
      when: "Days 1 to 30",
      title: "A month on real work",
      body: "It works next to your team on real customers and real paperwork. You can read every message it sends and every task it closes, and I tune it every week.",
    },
    {
      when: "Day 30",
      title: "The review",
      body: "We sit down with the numbers: hours saved, tasks done, anything it got wrong. If you want to keep it, it stays on for no more than half of what you'd pay a person in that role. If you don't, I switch it off and you owe nothing.",
    },
  ],
};

export const pilotWhy = {
  heading: "Why it's free",
  title: "You should see it working before you pay for it",
  paragraphs: [
    "Most business owners have heard plenty about AI and seen very little of it working inside a business like theirs. A demo on a video call won't change that, which is why I want to show you the real value of AI first, before you ever have to pay anything.",
    "After 30 days, if the AI Employee earns its place within your company, then my business maintains it and manages all of the technical stuff for you.",
    "If you don't see the value in using AI at the end of the month, then we part ways and you pay nothing.",
  ],
  signoff: "Brandon",
};

export const pilotFit = {
  eyebrow: "Who I'm looking for",
  title: "Apply if this sounds like you",
  yesTitle: "A good fit",
  yes: [
    "You run a business in or around Edmonton with roughly 5 or more employees.",
    "You've posted a job in the last 90 days, or you're about to.",
    "You have team members who are at max capacity and need some work taken off their plate.",
    "You and your team are actively searching for how AI can help everyone be more efficient, more productive, and ease the workload.",
  ],
  noTitle: "Probably not a fit",
  no: [
    "You want a chatbot on your website and nothing else.",
    "You can't spare a few hours for the visit.",
    "You're after a class on how to use ChatGPT.",
  ],
};

export const pilotRisk = {
  heading: "What it costs you",
  title: "A few hours of your time. That's our fee.",
  items: [
    { title: "No credit card", body: "I don't ask for payment details when you apply or at any point in the 30 days." },
    { title: "No contract", body: "There's nothing to sign to start. You decide at the day-30 review." },
    { title: "Keep the map", body: "The AI Opportunity Map is yours even if you never work with me." },
    {
      title: "50% savings, guaranteed",
      body: "Should you choose to continue running your AI Employee after the 30 days, we guarantee that you will save at least 50% of the cost of hiring a human to do the same job.",
    },
  ],
};

export const pilotAbout = {
  eyebrow: "Who's coming to your office",
  name: "Brandon Upright",
  role: "Founder, Unhired",
  body: "I am the founder of Unhired, and I'm born and raised in Edmonton. We've been building, training and maintaining AI Employees and custom AI systems for small and mid-sized businesses all over North America since 2021.",
  image: "/email/brandon-headshot.png",
};

export const pilotFaq = {
  eyebrow: "Questions",
  title: "Before you apply",
  items: [
    {
      q: "What is an AI Employee?",
      a: "An AI Employee is an intelligent AI that is built to take on a specific role and set of tasks inside of your business, exactly like a human employee does: answering calls and emails, booking appointments, following up with customers, keeping records up to date, automating systems and workflows. It works inside the tools you already use. We build it, train it on how your business operates, and maintain it for you, so nobody on your team has to manage it.\n\nThe best part? An AI Employee works 7 days a week, 24 hours a day, 365 days a year, and never complains or takes a lunch break!",
    },
    {
      q: "Is it really free?",
      a: "Yes! The visit, the Opportunity Map, the build and the 30 days of operation cost nothing. I won't even ask for your credit card.\n\nThe only thing I ask for is your time: a few hours for the visit and an hour or so for the review.",
    },
    {
      q: "What happens after the 30 days?",
      a: "You get to decide! If you want to keep the AI operational in your business, then you pay monthly, just like any other employee.\n\nAnd don't worry, my team will let you know what the price would be before we build anything, so there are no surprises. If you don't keep it, we shake hands and go our separate ways.",
    },
    {
      q: "Do I (or my team) need to know anything about AI or be tech-savvy?",
      a: "No. I set it up in the systems you already use. Your team keeps working the way they do now, but with less work on their plate! We maintain the AI Employee for you, including any future changes, updates, or training.",
    },
    {
      q: "What if my business uses confidential client information?",
      a: "Before the build, we show you exactly what data the AI Employee will touch and how it will operate. We implement secure data-handling systems to ensure that none of your data is ever used or stored in any way that you wouldn't approve of. You can read everything that the AI does during the 30 days.",
    },
    {
      q: "How do you choose the 5 businesses?",
      a: "I read every application myself. I pick the businesses where an AI Employee can make the biggest impact and help their team the most. Our goal is to show you first-hand how AI can EMPOWER your team, NOT replace them.",
    },
    {
      q: "How much does an AI Employee typically cost?",
      a: "The price of an AI Employee will range depending on the specific job that it is taking on and the size of the workload. The average cost to the business is approximately $2,000 per month, but we guarantee that it is AT LEAST 50% cheaper than hiring a human for the same role.",
    },
    {
      q: "After the 30 days, do I need to sign a contract with you?",
      a: "No. Just like any employee, you can \"fire\" them at any time. There are no long-term contracts to sign, so you can cancel or pause the AI Employee whenever necessary.",
    },
    {
      q: "What if I have multiple roles and tasks that I want AI to take on?",
      a: "No problem! We have built AI Employee Teams for larger businesses who have more than one position that needs to be filled.",
    },
    {
      q: "How do I know that my AI Employee is actually doing its job correctly?",
      a: "We build you your own custom dashboard that allows you to monitor all of the work that the AI Employee is currently doing, and has already completed. You can correct them, answer their questions, and see important performance metrics so that you always know just how productive they are.",
    },
  ],
};

export const pilotFinal = {
  title: "5 spots available.",
  highlight: "Apply for yours.",
  sub: "The application takes about two minutes, one question at a time. I read every one myself and reach out to the businesses I pick to book the visit.",
};

/**
 * The questionnaire at /pilot/apply, one question per screen.
 * Option values are stored as-is and drive the fit score in src/lib/pilot.ts.
 * `{business}` and `{first}` are filled in with the applicant's earlier answers.
 */
export const pilotQuiz = {
  intro: {
    kicker: "Pilot application",
    title: "Let's see if your business is a fit.",
    sub: "12 quick questions, one at a time. About two minutes.",
    start: "Start",
  },
  options: {
    teamSize: ["1 to 4", "5 to 15", "16 to 50", "51+"],
    revenue: ["Under $250K", "$250K to $500K", "$500K to $1M", "$1M to $3M", "$3M to $10M", "$10M+"],
    area: ["Edmonton", "St. Albert", "Sherwood Park", "Spruce Grove / Stony Plain", "Leduc / Nisku", "Further out"],
    hiring: ["Posted a job in the last 90 days", "Planning to hire in the next 3 months", "Not hiring right now"],
    ownerPresent: ["Yes", "No, a manager will be"],
  },
  questions: {
    business: { title: "What's the name of your business?", placeholder: "Acme Property Management" },
    industry: { title: "What does {business} do?", placeholder: "Property management, dental clinic, accounting firm..." },
    team_size: { title: "How many people work at {business}?" },
    revenue: { title: "Roughly what's your annual revenue?", hint: "A ballpark is fine. It tells me the size of your business." },
    area: { title: "Where is the business?" },
    hiring: { title: "Are you hiring right now?" },
    role: {
      title: "Which role are you hiring for, or which job eats the most hours?",
      placeholder: "Receptionist, office admin, bookkeeper...",
    },
    why_choose: {
      title: "Why should we pick {business} as one of the 5?",
      hint: "Tell me what's going on right now, what it's costing you, and why you want this solved now.",
      placeholder: "We're turning away calls every afternoon because our front desk is buried in...",
    },
    owner_present: { title: "Will the owner be there for the visit?" },
    name: { title: "Last few. What's your name?", first: "First name", last: "Last name" },
    email: { title: "What's the best email for you, {first}?", placeholder: "you@business.com" },
    phone: { title: "And your phone number?", hint: "We'll use it to book the visit.", placeholder: "780-555-0100" },
  },
  ok: "OK",
  submit: "Send my application",
  enterHint: "press Enter",
  back: "Back",
  privacy: "We'll only use this to reply about your application.",
  successTitle: "Application Submitted",
  successLead: "Thanks for applying!",
  successBody:
    "My team and I will review your application within the next 48 hours. If your business is a fit, the next step will be to schedule a follow up call so we can answer any of your questions and arrange a time for Brandon to come to your business.",
  backToPage: "Back to the page",
  errors: {
    required: "Please answer this one to continue.",
    email: "That email doesn't look right.",
    phone: "That phone number looks too short.",
    generic: "Something went wrong sending your application. Please try again, or email hello@unhired.io.",
  },
};
