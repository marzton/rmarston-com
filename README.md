# rmarston.com — Personal Portfolio

Personal career website for Robert Marston, DevOps Engineer & Cloud Architect.  
Live at **[rmarston.com](https://rmarston.com)**.

## Stack

| Layer | Ownership / Technology |
|---|---|
| Site | Static HTML/CSS (single-page portfolio) |
| Hosting | GitHub Pages |
| Domain | Cloudflare DNS + CNAME |
| Worker (`worker/index.ts`) | **Deprecated for this domain** (no active routes) |

## Route ownership (authoritative)

This repository uses the **"worker not active for rmarston.com"** deployment model:

- `rmarston.com` traffic is served directly by GitHub Pages.
- `wrangler.toml` must keep `routes = []` for this worker.
- Any legacy Cloudflare Worker route for this project should be removed from the Cloudflare dashboard so it cannot intercept `rmarston.com`.

This makes deployment ownership unambiguous and reproducible: GitHub Pages owns site serving, Cloudflare DNS owns domain mapping, and this worker owns no production route on `rmarston.com`.

## Contact handling location

Contact handling for `rmarston.com` is **not** hosted in this worker. The site contact path is handled outside this worker (direct email/LinkedIn links on the site and associated external messaging flows).

## Local Development

Open `index.html` directly in a browser — no build step required for the portfolio page.

The `src/` directory contains a legacy Bootstrap/Pug build system (Start Bootstrap "Clean Blog" template) that is no longer used for the main site.

## Legacy archive content

This repository also contains static legacy directories:

- **`/armsway`**: Patented Disposable Blood Pressure Sleeves.
- **`/solefoodny`**: Sneaker Boutique Brand Identity (#SFNY).
- **`index.html`**: Executive bio and directory links.

## Contact

- Email: [marstonr6@gmail.com](mailto:marstonr6@gmail.com)
- LinkedIn: [linkedin.com/in/r-marston](https://www.linkedin.com/in/r-marston)
- GitHub: [github.com/marzton](https://github.com/marzton)
