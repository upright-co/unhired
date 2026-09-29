export type FaqItem = { q: string; a: string };

export const faqs: FaqItem[] = [
  {
    q: "Do I need to know anything about AI?",
    a: "No. We build the AI Employee, train it on your business and maintain it from then on. You tell us about the role, we do everything technical, and you get a new team member that shows up knowing the job. If something needs adjusting later, you tell us and we handle it.",
  },
  {
    q: "What does the 50% guarantee actually mean?",
    a: "Whatever the role pays a person per year, your AI Employee costs at least half less than that. Most come in well under. The exact figure depends on the scope of the job, the volume it handles and how many systems we connect, and there are no recruiting fees, payroll taxes or benefits on top. If we can't guarantee it for your role, we tell you before you spend anything.",
  },
  {
    q: "Will this replace my staff?",
    a: "Not unless you want it to. Most owners use an AI Employee to fill a role they were about to hire for, or to take the phones, follow-ups and data entry off their current team so those people can do the work that needs a human. We replace the role, not the person.",
  },
  {
    q: "What can't an AI Employee do?",
    a: "Physical work, anything in person, and real relationship-building. It also shouldn't make licensed or high-stakes judgment calls, like legal or medical advice, pricing big custom jobs, or hiring and firing. We design every AI Employee to recognize those moments and hand off to a person.",
  },
  {
    q: "How long does it take to set up?",
    a: "Most AI Employees are on shift in days, not weeks. The timeline depends on how many tools we connect and how much of your process is already written down. Your assessment report shows what's involved for your role.",
  },
  {
    q: "Does it work with my tools (CRM, calendar, phone, email)?",
    a: "Usually, yes. AI Employees can work with common phone systems, email, SMS, calendars and CRMs. If a tool has an API or an integration platform connection, we can very likely connect it. If it doesn't, we'll tell you up front.",
  },
  {
    q: "Is my data safe?",
    a: "Your data is used to run your AI Employee and nothing else. You choose where it lives: we can host it locally, so it runs on your own computers or server and your data stays inside your network, or in the cloud, so your team can reach it from anywhere. Where your data is stored follows that choice.\n\nEither way we connect with the least access each task needs, keep credentials in a secrets vault rather than in the AI's instructions, encrypt data in transit and at rest, and log every action it takes so anything can be traced. Anything involving money, contracts or a decision you can't undo goes to a person for approval first.",
  },
  {
    q: "What if the AI makes a mistake?",
    a: "It will sometimes, just like a person. That's why we set clear rules for what it can do alone, send higher-risk actions to a person for review, and log every conversation so you can see exactly what happened. When something goes wrong, we fix the process so it doesn't happen again. That's part of maintaining it.",
  },
];
