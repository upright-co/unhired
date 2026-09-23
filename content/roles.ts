/**
 * Roles grid. `prefill` is what gets typed into the assessment's role field
 * when someone clicks "Unhire this role".
 * Icon names map to lucide icons in src/components/ui/Icon.tsx.
 */

export type RoleCard = {
  icon: string;
  title: string;
  prefill: string;
  tasks: string[];
};

export const roles: RoleCard[] = [
  {
    icon: "phone",
    title: "AI Receptionist",
    prefill: "Receptionist",
    tasks: [
      "Answers every call and text, day or night",
      "Qualifies new leads and captures job details",
      "Books appointments into your calendar",
      "Routes urgent calls to the right person",
    ],
  },
  {
    icon: "target",
    title: "Lead Follow-Up / Inside Sales",
    prefill: "Inside Sales Rep",
    tasks: [
      "Responds to new leads in minutes",
      "Runs multi-touch follow-up by text and email",
      "Chases open quotes and estimates",
      "Reactivates old leads and past customers",
    ],
  },
  {
    icon: "route",
    title: "Scheduling & Dispatch Coordinator",
    prefill: "Dispatcher",
    tasks: [
      "Books and reschedules jobs",
      "Sends confirmations and reminders",
      "Keeps crews and customers updated on arrival times",
      "Fills cancellations from the waitlist",
    ],
  },
  {
    icon: "database",
    title: "Admin & Data Entry Assistant",
    prefill: "Administrative Assistant",
    tasks: [
      "Enters and cleans up CRM records",
      "Processes forms, invoices and paperwork",
      "Organizes files and documents",
      "Prepares daily and weekly reports",
    ],
  },
  {
    icon: "star",
    title: "Review & Reputation Manager",
    prefill: "Reputation Manager",
    tasks: [
      "Requests reviews after every completed job",
      "Drafts replies to new reviews",
      "Flags unhappy customers for follow-up",
      "Tracks ratings across platforms",
    ],
  },
  {
    icon: "megaphone",
    title: "Social Media Coordinator",
    prefill: "Social Media Coordinator",
    tasks: [
      "Turns job photos into posts",
      "Keeps a consistent posting schedule",
      "Replies to comments and DMs",
      "Drafts monthly content calendars",
    ],
  },
  {
    icon: "headset",
    title: "Customer Support Rep",
    prefill: "Customer Service Representative",
    tasks: [
      "Answers common questions instantly",
      "Gives job status and billing updates",
      "Logs issues and opens tickets",
      "Escalates complex cases with full context",
    ],
  },
  {
    icon: "clipboard",
    title: "Transaction / Office Coordinator",
    prefill: "Transaction Coordinator",
    tasks: [
      "Tracks deadlines and milestones",
      "Collects documents and signatures",
      "Keeps every party updated",
      "Maintains checklists and files",
    ],
  },
];
