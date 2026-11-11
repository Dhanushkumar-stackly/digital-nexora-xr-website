# HD NEXORA WEBTEC

Website for HD NEXORA WEBTEC, a digital marketing and website solutions agency in Coimbatore, Tamil Nadu.
**Build Your Digital Presence. Grow Your Business.**

## Stack

- React 18, TypeScript and Vite
- Tailwind CSS with a single token-based theme in `src/theme.css`
- Three.js via React Three Fiber for the 3D scenes (loaded lazily, never in the first page load)
- A Vercel serverless function (`api/consultation.ts`) that emails consultation requests through Resend
- Hosted on Vercel; pushes to `main` deploy to production, other branches get preview deployments

## Where things live

| What | Where |
| --- | --- |
| Page copy (services, packages, process, industries…) | `src/constants/content.ts` |
| Page titles, descriptions and indexing per route | `src/constants/seo.ts` |
| Consultation form options | `src/constants/consultation.ts` (and the copy in `api/consultation.ts`) |
| Home page sections | `src/components/sections/` |
| Navbar and footer | `src/components/layout/` |
| Site-wide meta tags, Open Graph and business schema | `index.html` |
| robots.txt, sitemap.xml, share image | `public/` |

## Commands

```bash
npm install
npm run dev        # local development at http://localhost:5173
npm test           # unit tests (consultation function)
npm run lint
npm run build      # type check, client build, prerender of /, /privacy-policy and /terms-and-conditions
```

`npm run build` renders the main pages to static HTML (`scripts/prerender.mjs`) so search engines and slow
devices get content before JavaScript loads. Other routes are served by `dist/app-shell.html` (see `vercel.json`).

## Consultation emails

Set these in Vercel → Settings → Environment Variables (see `.env.example`):

- `RESEND_API_KEY`
- `CONSULTATION_TO_EMAIL` – inbox that receives enquiries (never shown on the site)
- `CONSULTATION_FROM_EMAIL` – sender on a domain verified in Resend (SPF/DKIM)
- `CONSULTATION_BACKUP_EMAIL` – optional backup copy of every enquiry

Until these are set, the form shows visitors a "temporarily unavailable" message with a WhatsApp link instead of
pretending to succeed.

## Domain

`SITE_URL` in `src/constants/seo.ts`, the URLs in `index.html`, `public/robots.txt` and `public/sitemap.xml` use
the Vercel address. Update them together when a custom domain is connected.
