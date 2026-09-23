import { footer, nav } from "@/content/copy";
import { siteConfig } from "@/config";
import { Logo } from "@/components/ui/Logo";

export function Footer({ minimal = false }: { minimal?: boolean }) {
  const year = new Date().getFullYear();
  return (
    <footer className="no-print px-4 pt-14 pb-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 border-t border-ink/10 pt-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <a href={minimal ? "/" : "#top"} aria-label="Unhired home" className="inline-block">
            <Logo className="h-7" />
          </a>
          <p className="mt-3 text-muted">{footer.description}</p>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="mt-3 inline-block font-medium text-violet-deep hover:underline"
          >
            {siteConfig.contactEmail}
          </a>
        </div>
        {!minimal && (
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3">
              {nav.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-muted hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={siteConfig.privacyPolicyUrl} className="text-muted hover:text-ink">
                  {footer.privacyLabel}
                </a>
              </li>
            </ul>
          </nav>
        )}
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col justify-between gap-2 text-sm text-muted sm:flex-row">
        <p>© {year} Unhired. All rights reserved.</p>
        {minimal && (
          <a href={siteConfig.privacyPolicyUrl} className="hover:text-ink">
            {footer.privacyLabel}
          </a>
        )}
      </div>
    </footer>
  );
}
