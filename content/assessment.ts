/** Copy and options for the AI Hire Assessment flow. */

export const industries = [
  "Contractor/Renovation",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Real Estate",
  "Property Management",
  "Clinic/Health",
  "Legal",
  "Agency",
  "Other",
] as const;

export const teamSizes = ["1–5", "6–15", "16–50", "50+"] as const;

export const assessmentSection = {
  eyebrow: "The AI Hire Assessment",
  title: "Can AI do this job?",
  sub: "Takes about 3 minutes. Get a free report on how much of this role AI can handle.",
};

export const assessmentCopy = {
  steps: ["The role", "The job", "Questions", "Your report"],
  role: {
    heading: "What role are you thinking of hiring for?",
    sub: "Start with the job title you'd put on the posting.",
    roleLabel: "Role title",
    rolePlaceholder: "e.g. Receptionist",
    industryLabel: "Industry",
    teamSizeLabel: "Team size",
    next: "Next",
  },
  job: {
    heading: "What would this person do?",
    sub: "The more detail you give, the sharper your report.",
    uploadTab: "Upload job description",
    describeTab: "Describe the job",
    uploadHint: "PDF, DOCX or TXT · up to 5MB",
    uploadCta: "Choose a file or drag it here",
    describePlaceholder:
      "What would this person do day to day? What tools would they use? Who would they talk to?",
    wordsNeeded: (n: number) => `${n} more word${n === 1 ? "" : "s"} for a useful report`,
    wordsOk: "Good detail. Keep going if you like.",
    next: "Continue",
  },
  questions: {
    budget: {
      prompt: "What would you expect to pay this hire?",
      help: "Used only for your cost comparison. Skip it if you're not sure.",
      annual: "per year",
      hourly: "per hour",
      skip: "Not sure yet",
    },
    other: "Other",
    next: "Next",
    back: "Back",
  },
  teaser: {
    ready: "Your report is ready.",
    sub: "Where should we send it?",
    firstName: "First name",
    email: "Email",
    business: "Business name",
    phone: "Phone (optional)",
    submit: "Get my report",
    privacy: "We'll never sell your info.",
  },
  loading: {
    session: ["Opening a new file…"],
    extract: ["Reviewing the job description…", "Pulling out the day-to-day tasks…"],
    questions: [
      "Reviewing the job description…",
      "Interviewing your future AI hire…",
      "Drafting a few sharp questions…",
    ],
    followup: ["Checking my notes…", "Making sure I have the full picture…"],
    report: [
      "Breaking the role into tasks…",
      "Interviewing your future AI hire…",
      "Deciding what stays with your team…",
      "Running the numbers…",
    ],
    submit: ["Finalizing your report…", "Sending it to your inbox…"],
  },
  errors: {
    generic: "Something went wrong on our end. Your answers are saved. Try again.",
    rateLimited: "You've run a lot of assessments this hour. Please try again a little later.",
    retry: "Try again",
  },
};
