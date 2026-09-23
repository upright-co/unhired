/**
 * One-time Resend setup. Run from the project root:
 *
 *   node --env-file=.env.local scripts/setup-resend.mjs
 *
 * Creates (and is safe to re-run):
 *   - the sending domain + prints the DNS records to add
 *   - the six contact properties the assessment writes
 *   - the "Assessment leads" segment and "Weekly newsletter" topic
 *
 * Prints the RESEND_SEGMENT_ID / RESEND_TOPIC_ID to put in .env.local.
 * Never prints the API key.
 */
import { Resend } from "resend";

const DOMAIN = process.argv[2] || "unhired.io";

const key = process.env.RESEND_API_KEY;
if (!key) {
  console.error("RESEND_API_KEY is not set. Run with: node --env-file=.env.local scripts/setup-resend.mjs");
  process.exit(1);
}
const resend = new Resend(key);

const PROPERTIES = [
  { key: "business", type: "string" },
  { key: "industry", type: "string" },
  { key: "role", type: "string" },
  { key: "ai_coverage_score", type: "number" },
  { key: "team_size", type: "string" },
  { key: "source", type: "string" },
];

function fail(label, error) {
  console.log(`   ✗ ${label}: ${error.name ?? "error"} — ${error.message}`);
}

/* ---------- 1. Domain ---------- */
console.log(`\n1. Domain: ${DOMAIN}`);
const existingDomains = await resend.domains.list();
let domain = existingDomains.data?.data?.find((d) => d.name === DOMAIN);

if (domain) {
  console.log(`   already added (id ${domain.id}, status: ${domain.status})`);
} else {
  const created = await resend.domains.create({ name: DOMAIN });
  if (created.error) fail("create domain", created.error);
  else {
    domain = created.data;
    console.log(`   created (id ${domain.id}, status: ${domain.status})`);
  }
}

if (domain) {
  const full = await resend.domains.get(domain.id);
  const records = full.data?.records ?? [];
  console.log(`   status: ${full.data?.status}`);
  if (records.length) {
    console.log("\n   DNS records to add in Cloudflare (proxy OFF / DNS only):");
    for (const r of records) {
      console.log(`   ─────────────────────────────────────────────`);
      console.log(`   type:  ${r.type}`);
      console.log(`   name:  ${r.name}`);
      console.log(`   value: ${r.value}`);
      if (r.priority) console.log(`   priority: ${r.priority}`);
      if (r.ttl) console.log(`   ttl:   ${r.ttl}`);
    }
    console.log(`   ─────────────────────────────────────────────`);
  }
}

/* ---------- 2. Contact properties ---------- */
console.log("\n2. Contact properties");
const existingProps = await resend.contactProperties.list();
const haveProps = new Set((existingProps.data?.data ?? []).map((p) => p.key));
for (const p of PROPERTIES) {
  if (haveProps.has(p.key)) {
    console.log(`   = ${p.key} (${p.type}) already exists`);
    continue;
  }
  const res = await resend.contactProperties.create(p);
  if (res.error) fail(p.key, res.error);
  else console.log(`   + ${p.key} (${p.type})`);
}

/* ---------- 3. Segment ---------- */
console.log("\n3. Segment");
const SEGMENT_NAME = "Assessment leads";
const segments = await resend.segments.list();
let segment = segments.data?.data?.find((s) => s.name === SEGMENT_NAME);
if (!segment) {
  const res = await resend.segments.create({ name: SEGMENT_NAME });
  if (res.error) {
    fail("create segment", res.error);
    console.log("   → optional: leads still carry the `source` property, so this can wait.");
    console.log(`   → existing segments: ${(segments.data?.data ?? []).map((s) => s.name).join(", ")}`);
  } else segment = res.data;
}
if (segment) console.log(`   "${SEGMENT_NAME}" → RESEND_SEGMENT_ID=${segment.id}`);

/* ---------- 4. Topic ---------- */
console.log("\n4. Topic");
const TOPIC_NAME = "Weekly newsletter";
const topics = await resend.topics.list();
let topic = topics.data?.data?.find((t) => t.name === TOPIC_NAME);
if (!topic) {
  const res = await resend.topics.create({
    name: TOPIC_NAME,
    description: "Weekly tips on putting AI employees to work in trade and service businesses.",
    // Nobody is subscribed unless they ticked the consent box (CASL express consent).
    defaultSubscription: "opt_out",
  });
  if (res.error) fail("create topic", res.error);
  else topic = res.data;
}
if (topic) console.log(`   "${TOPIC_NAME}" → RESEND_TOPIC_ID=${topic.id}`);

console.log("\nDone.\n");
