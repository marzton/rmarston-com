# Domain Boundaries

## Authoritative surface

The apex (`rmarston.com`) and `www.rmarston.com` are served by the AI Studio
app `rob-marston-portfolio`, not by this repository's Worker. This repo
(the `rmarston-com` Worker) owns only the `api.`, `admin.`, and `preview.`
subdomains.

## Intended deployment model

- Do not attach `rmarston.com/*` or `www.rmarston.com/*` as routes on the
  `rmarston-com` Worker — those routes were removed to free the apex/www
  for the AI Studio app. A Worker route takes precedence over plain DNS
  records, so re-adding either route here will silently hijack the domain
  away from AI Studio again.
- Worker routes here should stay limited to `api.rmarston.com/*`,
  `admin.rmarston.com/*`, and `preview.rmarston.com/*`.
- Do not attach `goldshore.ai`, `goldshore.org`, `gw.goldshore.ai`, `gateway.goldshore.ai`, `banproof.me`, or `armsway.com` here.

## Current operational notes

- DNS for the apex and `www` should point at Google's AI Studio / Cloud Run
  IPs (A: 216.239.32/34/36/38.21, AAAA: 2001:4860:4802:32/34/36/38::15),
  set to DNS-only (grey cloud), not proxied.
- If the wrong app appears at rmarston.com, check for a re-added Worker
  route on this Worker before touching DNS.
- Remove stale domain bindings from legacy Pages projects before re-binding
  anything to this domain.

## Why this file exists

The goal is to reduce routing drift, prevent stale landing pages from reclaiming the apex, and make the ownership boundary obvious during deployment recovery.
