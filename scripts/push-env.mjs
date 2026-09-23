/**
 * Pushes the production environment variables to Vercel from .env.local.
 * Values are piped to the CLI and never printed.
 *   node scripts/push-env.mjs [--dry]
 */
import { readFileSync } from "fs";
import { execFileSync } from "child_process";
import { randomBytes } from "crypto";

const DRY = process.argv.includes("--dry");

// Only these reach production. Porkbun keys and ASSESSMENT_MOCK stay local.
const FROM_ENV_FILE = [
  "ANTHROPIC_API_KEY",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "RESEND_FROM_NAME",
  "RESEND_TOPIC_ID",
];

const env = {};
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const values = {};
for (const k of FROM_ENV_FILE) {
  if (env[k]) values[k] = env[k];
  else console.log(`  ! ${k} missing from .env.local — skipped`);
}
// Production-specific overrides
values.NEXT_PUBLIC_SITE_URL = "https://unhired.io";
// A dedicated production secret rather than one derived from the Anthropic key
values.SESSION_SECRET = randomBytes(32).toString("base64url");

for (const [key, value] of Object.entries(values)) {
  if (DRY) {
    console.log(`  would set ${key} (${value.length} chars)`);
    continue;
  }
  // Remove any existing value first so re-runs are idempotent.
  try {
    execFileSync("npx", ["--yes", "vercel", "env", "rm", key, "production", "--yes", "--scope", "unhired"], {
      stdio: "ignore",
    });
  } catch {
    /* not set yet */
  }
  execFileSync("npx", ["--yes", "vercel", "env", "add", key, "production", "--scope", "unhired"], {
    input: value,
    stdio: ["pipe", "ignore", "pipe"],
  });
  console.log(`  ✓ ${key}`);
}
console.log(DRY ? "\nDry run only." : "\nProduction environment set.");
