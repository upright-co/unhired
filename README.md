# Unhired

One-page marketing site plus the **AI Hire Assessment**: an AI-powered survey that analyzes a role and emails the visitor a personalized "AI Employee Opportunity Report."

Built with Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Anthropic API (`claude-sonnet-5`) · Supabase · Resend. Deploy target: Vercel.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev                  # http://localhost:3000
```

**No API keys yet?** Set `ASSESSMENT_MOCK=1` in `.env.local` to click through the whole assessment with canned AI responses. Without Supabase env vars, assessments are kept in memory, and without Resend, emails are skipped with a log line. Mock mode is ignored in production.

Add your brand files:

- `public/unhired-logo.png`: the full logo (nav, footer, printed report)
- `public/unhired-icon.png`: the source icon mark
- `public/unhired-mark.png`: square 512×512 favicon, generated from the icon
- `public/apple-icon.png`: square 512×512 on white, for iOS home screens

Until the logo exists, the site shows a text wordmark in the same style.
**Filenames are case-sensitive in production** (Linux) even though macOS ignores case — keep these exact names.

## Environment variables

| Variable | Required | What it's for |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes | Claude calls (server-side only, never sent to the browser) |
| `SUPABASE_URL` | yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-side DB access (bypasses RLS). Never expose it. |
| `RESEND_API_KEY` | yes | Report delivery + contact list |
| `RESEND_FROM_EMAIL` | yes | Sender address on a domain verified in Resend |
| `RESEND_FROM_NAME` | optional | Sender display name (default "Unhired") |
| `RESEND_SEGMENT_ID` | optional | Leads are added to this segment |
| `RESEND_TOPIC_ID` | optional | Leads are opted in to this topic (newsletter subscriptions) |
| `NEXT_PUBLIC_SITE_URL` | yes | e.g. `https://unhired.ai`. Used for report links, OG and sitemap |
| `SESSION_SECRET` | optional | Signs the session cookie and proof-of-work challenges. Defaults to a key derived from `ANTHROPIC_API_KEY`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | optional | Only if you switch to Cloudflare Turnstile (see Bot protection) |
| `TURNSTILE_SECRET_KEY` | optional | Turnstile secret; when set, Turnstile replaces proof-of-work |
| `ASSESSMENT_MOCK` | dev only | `1` = canned AI responses |

On Vercel, add these under Project → Settings → Environment Variables.

## Supabase setup

1. Create a project, then open **SQL Editor**.
2. Paste and run [`supabase/migrations/001_assessments.sql`](supabase/migrations/001_assessments.sql), then [`002_rename_list_synced.sql`](supabase/migrations/002_rename_list_synced.sql).

This creates:

- `assessments`: one row per assessment. It's a `draft` once the report is generated and becomes `completed` after the email step. It stores the role, description, answers (jsonb), report (jsonb), coverage, contact details, CASL consent text + timestamp, UTM params and delivery timestamps.
- `rate_limit_hits`: per-IP (hashed) request log for rate limiting.

Row Level Security is on with no policies, so only the service-role key (used server-side) can read or write.

## Resend setup (email + list)

Free plan covers: **1,000 contacts, unlimited broadcast sending** (the weekly newsletter) and **3,000 transactional emails/month, 100/day** (the report emails). No provider branding on your emails.

1. Sign up at https://resend.com.
2. **Domains → Add domain.** Enter the domain you'll send from, then add the DNS records it gives you (DKIM, SPF, and a DMARC record) at your registrar. Wait for the status to go green. You can't send from a `@gmail.com` address.
3. **API Keys → Create API Key** with send access. Put it in `RESEND_API_KEY`, and set `RESEND_FROM_EMAIL` to an address on the verified domain.
4. Optional but recommended, both creatable over the API:
   - a **segment** for assessment leads → `RESEND_SEGMENT_ID`
   - a **topic** such as "Weekly newsletter" → `RESEND_TOPIC_ID`. Leads who tick the consent box are opted in, and Resend then manages their subscription and unsubscribes for you.

Contacts are stored with custom properties (`business`, `industry`, `role`, `ai_coverage_score`, `team_size`, `source`) so you can segment by score or industry. All of that also lives in Supabase, so nothing depends on the provider.

The report email template is [`src/lib/emailTemplate.ts`](src/lib/emailTemplate.ts). Provider calls are all in [`src/lib/email.ts`](src/lib/email.ts) — about 100 lines, which is the entire surface to rewrite if you ever switch providers.

### Sending the weekly newsletter

Use **Broadcasts** in Resend (or the Broadcasts API). Broadcast sends aren't limited by the 100/day transactional cap; the 1,000-contact ceiling on the free plan is the number that matters as the list grows.

## Bot protection

Every AI call costs money, so the assessment endpoints are protected without depending on any third-party account:

1. **Proof of work.** `GET /api/assessment/challenge` returns a signed, expiring salt. The browser finds a nonce whose SHA-256 hash starts with N zero bits (`assessmentConfig.powDifficulty`, default 18 ≈ half a second of CPU) and posts it to `/api/assessment/session`, which returns a signed, httpOnly session cookie. Every other endpoint requires that cookie. The work is solved in a Web Worker as soon as the page loads, so a real visitor never waits; a bot pays that CPU cost on every attempt.
2. **Honeypot.** A hidden `website` field on step 1 and the email gate. Filled in = rejected.
3. **Per-IP rate limits**, per endpoint, per hour (`assessmentConfig.rateLimits`). IPs are stored as salted hashes.
4. **Global daily cap** (`assessmentConfig.dailyReportCap`, default 200) — a hard ceiling on report generations site-wide per day, so nothing can run up an unbounded Anthropic bill.

Tuning: raise `powDifficulty` if you ever see scripted abuse (each +1 doubles the attacker's cost), lower it if slow phones struggle.

**Optional: Cloudflare Turnstile.** If you set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`, Turnstile replaces proof of work automatically — no code change. It needs a Cloudflare account; proof of work doesn't.

## How the assessment works

```
Step 1  Role, industry, team size ─► POST /api/assessment/session   (honeypot + proof-of-work → cookie)
Step 2  Upload (PDF/DOCX/TXT ≤5MB) ─► POST /api/assessment/extract  (pdf-parse / mammoth, capped at 15k chars)
        or describe (≥50 words)
Step 3  Adaptive questions ─────────► POST /api/assessment/questions (round 1: 4–6 questions)
                                      POST /api/assessment/questions (round 2: up to 3 more if Claude
                                                                      flags needs_more_info)
        Budget question (fixed, optional; feeds the cost comparison)
        ────────────────────────────► POST /api/assessment/report    (Claude → zod-validated JSON, saved as
                                                                      a draft; only coverage + tier returned)
Step 4  Teaser gauge + email gate ──► POST /api/assessment/submit    (stores contact + consent, returns the
                                                                      full report, then emails the link and
                                                                      syncs the contact list in the background)
Step 5  Report on-page + /report/[id]
```

Notes:

- **Report generation happens before the email gate** so the teaser gauge shows the visitor's real score. The full report only leaves the server after the email step, and `/report/[id]` returns 404 until the assessment is `completed`. Ids are random v4 UUIDs.
- **Claude calls** live in [`src/lib/claude.ts`](src/lib/claude.ts) and use structured outputs (`messages.parse` + zod). Invalid or truncated output is retried once. The prompts are in [`src/lib/prompts.ts`](src/lib/prompts.ts); job descriptions and answers are wrapped in tags and treated as data, not instructions.
- **Numbers the site owns:** the verdict tier is recomputed from `coverage_percent` (80/60/35 thresholds), and `human_annual_cost_input` comes only from what the visitor typed. Claude is told not to state any dollar figures.
- **Rate limits and the daily cap** are in `config.ts` → `assessmentConfig`. See Bot protection above.
- **Analytics:** `trackEvent()` in [`src/lib/analytics.ts`](src/lib/analytics.ts) fires `assessment_started`, `step_completed`, `email_submitted`, `report_viewed` and `cta_clicked`. It pushes to `dataLayer`, calls `gtag` / `fbq` if present (`email_submitted` → Meta `Lead`), and dispatches a `unhired:analytics` window event. Add your GTM / GA4 / Pixel snippet to `src/app/layout.tsx`.
- **UTM params** are captured on first page load (sessionStorage) and saved with the submission.
- **PDF:** "Print / save PDF" uses the print stylesheet (browser print → Save as PDF).

## Editing content

Everything editable lives outside the components:

| File | What's in it |
|---|---|
| `config.ts` | Starting price (`pricing.aiHireStartingAt`; `null` shows `[PRICE]`), book-a-call + challenge links (`null` hides the button), contact email, consent wording, rate limits, PoW difficulty, daily cap, model, upload limits |
| `content/copy.ts` | All section copy: nav, hero (incl. live-feed items), reframe, hidden costs, comparison rows, how it works, final CTA, footer |
| `content/roles.ts` | Roles grid (title, icon, tasks, the role name prefilled into the assessment) |
| `content/faq.ts` | FAQ questions and answers |
| `content/testimonials.ts` | Results cards (placeholder data; add `image` for a logo/photo) |
| `content/assessment.ts` | Industries, team sizes, assessment step copy, loading messages, errors |
| `src/app/privacy/page.tsx` | Placeholder privacy policy. **Replace before launch.** |

### Placeholders to fill before launch

Search the project for `[` to find them all:

- `[STAT — source needed…]`: hidden-costs cards, comparison table, report cost comparison. No statistics were invented. Add sourced figures.
- `[PRICE]`: set `pricing.aiHireStartingAt` in `config.ts`.
- `links.bookCall` / `links.challenge` in `config.ts`: `null` until you have the URLs (the report falls back to a mailto CTA).
- `[ADD: …]`: data-handling details in the "Is my data safe?" FAQ.
- Testimonials: `content/testimonials.ts`.

## Project structure

```
config.ts                     prices, links, limits
content/                      editable copy + data
src/app/
  page.tsx                    one-page site
  report/[id]/page.tsx        shareable report
  api/assessment/*            session, extract, questions, report, submit
  opengraph-image.tsx         OG image (brand gradient + wordmark)
src/components/
  sections/                   Nav, Hero, Reframe, HiddenCosts, Roles, Comparison, HowItWorks,
                              AssessmentSection, Testimonials, Faq, FinalCta, Footer
  assessment/                 multi-step flow + proof-of-work challenge
  report/ReportView.tsx       report UI (on-page and /report/[id], print-friendly)
  ui/                         logo, icons, gauge, glass/glow primitives
src/lib/                      Claude client, prompts, zod schemas, Supabase store, Resend email,
                              rate limiting, session + proof-of-work, analytics, UTM
supabase/migrations/          SQL
```

## Deploying to Vercel

1. Import the repo, framework preset Next.js.
2. Add the environment variables (production + preview).
3. Deploy. The report route allows up to 120s (`maxDuration`). If your Vercel plan caps function duration lower, lower `max_tokens` / effort in `src/app/api/assessment/report/route.ts`.
