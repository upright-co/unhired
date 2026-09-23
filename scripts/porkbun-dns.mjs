/**
 * Porkbun DNS helper. Reads PORKBUN_API_KEY / PORKBUN_SECRET_KEY from the env.
 *   node --env-file=.env.local scripts/porkbun-dns.mjs list
 *   node --env-file=.env.local scripts/porkbun-dns.mjs add <type> <name|""> <content> [ttl]
 *   node --env-file=.env.local scripts/porkbun-dns.mjs delete <id>
 */
const DOMAIN = process.env.PORKBUN_DOMAIN || "unhired.io";
const auth = {
  apikey: process.env.PORKBUN_API_KEY,
  secretapikey: process.env.PORKBUN_SECRET_KEY,
};
if (!auth.apikey || !auth.secretapikey) {
  console.error("PORKBUN_API_KEY / PORKBUN_SECRET_KEY not set");
  process.exit(1);
}

async function call(path, body = {}) {
  const res = await fetch(`https://api.porkbun.com/api/json/v3${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...auth, ...body }),
  });
  return res.json();
}

const [cmd, ...args] = process.argv.slice(2);

if (cmd === "list") {
  const r = await call(`/dns/retrieve/${DOMAIN}`);
  if (r.status !== "SUCCESS") { console.log(JSON.stringify(r)); process.exit(1); }
  for (const rec of r.records) {
    console.log(`${rec.id.padStart(12)}  ${rec.type.padEnd(6)} ${rec.name.padEnd(30)} ${String(rec.content).slice(0, 50)}`);
  }
} else if (cmd === "add") {
  const [type, name, content, ttl = "600"] = args;
  const r = await call(`/dns/create/${DOMAIN}`, { type, name: name === '""' ? "" : name, content, ttl });
  console.log(JSON.stringify(r));
} else if (cmd === "delete") {
  console.log(JSON.stringify(await call(`/dns/delete/${DOMAIN}/${args[0]}`)));
} else {
  console.log("commands: list | add <type> <name> <content> [ttl] | delete <id>");
}
