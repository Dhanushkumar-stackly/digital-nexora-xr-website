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

## WhatsApp notifications (optional)

Each enquiry can also be sent to the business WhatsApp number through Meta's WhatsApp Cloud API. A request
succeeds when at least one channel (email or WhatsApp) reaches the business.

1. developers.facebook.com → Create app → Business → add the **WhatsApp** product.
2. In WhatsApp → API Setup, add the receiving number (e.g. +91 99437 11466) to the "To" list and verify it.
   The number that *sends* must not be one used in the normal WhatsApp app; Meta's free test number works.
3. WhatsApp Manager → Message templates → create a **Utility** template named `new_enquiry`, language English,
   with this body (6 variables, in this order):

   ```
   New consultation request {{1}}: {{2}} from {{3}}, phone {{4}}, interested in {{5}}, budget {{6}}. Full details are in your email.
   ```

4. Create a permanent token (Business settings → System users → generate token with `whatsapp_business_messaging`).
5. Set in Vercel: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_NOTIFY_TO`, then redeploy.

## Domain

`SITE_URL` in `src/constants/seo.ts`, the URLs in `index.html`, `public/robots.txt` and `public/sitemap.xml` use
the Vercel address. Update them together when a custom domain is connected.
