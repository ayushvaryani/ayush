# KG Traders — Brand Website

Interactive animated landing page for **KG Traders**, premium ethnic wear
manufacturers & wholesalers, Ahmedabad. Brand-interaction site only — no
e-commerce (strictly B2B/wholesale).

**Live domain:** `k.g.traders.co.in` (GoDaddy)

## What's inside

- `index.html` — single-page site: hero, collections, sizes, wholesale enquiry
- `css/style.css` — dark luxury theme (olive-gold / plum / ivory / mustard,
  drawn from the KG product line)
- `js/main.js` — animations: flowing silk canvas + gold "zari dust" particles,
  GSAP scroll reveals, 3D tilt collection cards, magnetic buttons, animated
  counters, smooth scrolling (Lenis)
- `assets/logo.svg` — generated KG monogram (replace with your real logo)
- `assets/products/` — drop your product photos here (see its README for
  exact filenames); until then cards show gold line-art placeholders
- `CNAME` — custom-domain file for GitHub Pages

## Contact details (already wired in)

- WhatsApp: +91 70163 64717 (`wa.me` enquiry button)
- Email: ayushvaryani5@gmail.com
- Address: C-331–336, 3rd Floor, Sumel Business Park 3, Opp. New Cloth
  Market, Sarangpur, Ahmedabad 380002

## Before going live

- **Photos & logo** — add files per `assets/products/README.md`.

## Deploy free with GitHub Pages + GoDaddy domain

1. In this GitHub repo: **Settings → Pages → Source: Deploy from a branch**,
   pick your branch, folder `/ (root)`, save.
2. In GoDaddy DNS for your domain, add a **CNAME record** pointing your
   website host (e.g. `www` or the subdomain you use) to
   `<your-github-username>.github.io`.
   For an apex/root domain, add **A records** to GitHub Pages IPs:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
3. Back in **Settings → Pages**, enter the custom domain (must match the
   `CNAME` file) and enable **Enforce HTTPS** once the certificate is issued.

Any static host works too (Netlify, Cloudflare Pages, Vercel) — the site is
plain HTML/CSS/JS with no build step.

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## MCP servers (development tooling)

This repo ships a project-scoped MCP configuration in [`.mcp.json`](.mcp.json)
for the 21st.dev Magic MCP (HTTP transport, `x-api-key` from the
`API_KEY_21ST` environment variable):

```bash
export API_KEY_21ST=<your 21st.dev API key>
claude mcp list   # verify after starting Claude Code in this repo
```
