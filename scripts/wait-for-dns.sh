#!/bin/bash
# Waits for the .io delegation to point at Porkbun, then triggers Resend verification.
for i in $(seq 1 90); do
  NS=$(dig NS unhired.io @a0.nic.io +noall +authority 2>/dev/null | awk '{print $5}' | tr '\n' ' ')
  if echo "$NS" | grep -q porkbun; then
    echo "DELEGATION FLIPPED to: $NS"
    dig +short TXT resend._domainkey.unhired.io @8.8.8.8 | head -1 | cut -c1-30
    node --env-file=.env.local -e '
      const {Resend}=require("resend"); const r=new Resend(process.env.RESEND_API_KEY);
      (async()=>{ const l=await r.domains.list(); const d=l.data?.data?.find(x=>x.name==="unhired.io");
      await r.domains.verify(d.id); await new Promise(s=>setTimeout(s,20000));
      const g=await r.domains.get(d.id); console.log("RESEND STATUS:", g.data?.status); })()'
    exit 0
  fi
  sleep 60
done
echo "TIMEOUT: delegation still $NS"
