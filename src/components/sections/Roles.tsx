"use client";

import { ArrowRight, Check } from "lucide-react";
import { roles } from "@/content/roles";
import { rolesSection } from "@/content/copy";
import { IconTile } from "@/components/ui/Icon";
import { StatusDot } from "@/components/ui/Decor";
import { Reveal, SectionHeading } from "@/components/ui/Section";
import { PREFILL_EVENT } from "@/components/assessment/Assessment";
import { trackEvent } from "@/lib/analytics";

export function Roles() {
  return (
    <section id="roles" aria-labelledby="roles-title" className="relative px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="roles-title" eyebrow={rolesSection.eyebrow} title={rolesSection.title} sub={rolesSection.sub} />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role, i) => (
            <Reveal
              as="li"
              key={role.title}
              delay={(i % 4) * 0.06}
              className="glass group flex flex-col rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <IconTile name={role.icon} />
                <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold text-green-deep">
                  <StatusDot /> Available
                </span>
              </div>
              <h3 className="mt-5 text-lg leading-snug font-semibold tracking-tight">{role.title}</h3>
              <ul className="mt-3 flex-1 space-y-2">
                {role.tasks.map((t) => (
                  <li key={t} className="flex gap-2 text-[0.92rem] leading-snug text-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-violet-deep" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
              <a
                href="#assessment"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: role.prefill }));
                  trackEvent("cta_clicked", { cta: "role_card", role: role.title });
                }}
                className="mt-6 inline-flex items-center gap-1.5 self-start rounded-full text-sm font-semibold text-violet-deep transition-all group-hover:gap-2.5"
              >
                {rolesSection.linkLabel}
                <ArrowRight className="size-4" aria-hidden />
                <span className="sr-only">: {role.title}</span>
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mx-auto mt-10 max-w-2xl text-center">
          <p className="text-lg text-muted">
            {rolesSection.notListed}{" "}
            <a href="#assessment" className="font-semibold text-violet-deep underline underline-offset-4">
              Take the assessment →
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
