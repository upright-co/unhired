import {
  AlertTriangle,
  CalendarX,
  ClipboardList,
  Clock,
  Database,
  GraduationCap,
  Headset,
  Megaphone,
  Phone,
  Receipt,
  RefreshCw,
  Route,
  Search,
  Star,
  Target,
  Users,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  alert: AlertTriangle,
  "calendar-x": CalendarX,
  clipboard: ClipboardList,
  clock: Clock,
  database: Database,
  graduation: GraduationCap,
  headset: Headset,
  megaphone: Megaphone,
  phone: Phone,
  receipt: Receipt,
  refresh: RefreshCw,
  route: Route,
  search: Search,
  star: Star,
  target: Target,
  users: Users,
};

/** Maps icon names used in /content to lucide icons. Unknown names fall back to a sparkle. */
export function Icon({ name, className = "size-5" }: { name: string; className?: string }) {
  const C = map[name] ?? Sparkles;
  return <C className={className} aria-hidden strokeWidth={1.8} />;
}

/** Icon inside a soft gradient tile. */
export function IconTile({ name }: { name: string }) {
  return (
    <span className="relative inline-grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-coral/15 to-violet/20 text-violet-deep ring-1 ring-white">
      <Icon name={name} />
    </span>
  );
}
