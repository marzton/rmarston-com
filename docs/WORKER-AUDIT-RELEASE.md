# Contact mail release prerequisites

The Worker keeps its configured Resend transport when `RESEND_API_KEY` is present. Otherwise it uses the already declared `SEND_EMAIL` binding and `CONTACT_FROM_EMAIL` sender. Missing transport returns 503; mail delivery failures return 500. It no longer reports a successful submission solely because it logged the inquiry.

Before release, verify the sender and recipient are authorized by Cloudflare Email Routing, run `node --test --test-isolation=none worker/contact.test.mjs` on Node 24, run the existing Jest suite in a complete dependency-installed checkout, and dry-run Wrangler. Confirm where the separately hosted public apex submits its form; this Worker owns only the configured api/admin/preview subdomains.

No email settings, DNS, secrets, or deployments were changed by this commit.
