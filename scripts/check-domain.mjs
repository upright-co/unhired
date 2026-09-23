/** Polls Resend until the sending domain verifies. Usage: node --env-file=.env.local scripts/check-domain.mjs */
import { Resend } from "resend";
const r = new Resend(process.env.RESEND_API_KEY);
const name = process.argv[2] || "unhired.io";
const list = await r.domains.list();
const d0 = list.data?.data?.find((d) => d.name === name);
if (!d0) { console.log(`${name} is not in this Resend account`); process.exit(1); }
for (let i = 0; i < 20; i++) {
  const d = await r.domains.get(d0.id);
  const st = d.data?.status;
  if (st === "verified" || st === "failure") {
    console.log("FINAL status:", st);
    for (const rec of d.data?.records ?? []) console.log(` ${rec.type} ${rec.name} -> ${rec.status}`);
    process.exit(0);
  }
  await new Promise((x) => setTimeout(x, 15000));
}
const d = await r.domains.get(d0.id);
console.log("still:", d.data?.status);
for (const rec of d.data?.records ?? []) console.log(` ${rec.type} ${rec.name} -> ${rec.status}`);
