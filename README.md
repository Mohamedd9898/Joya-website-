# JOYA

A working English/Arabic website and content administration system for JOYA. Built with Next.js 15, React 19, TypeScript, Framer Motion and PostgreSQL. The design uses a custom CSS system, locally hosted typography, responsive WebP photography and CSS perspective for meaningful physical/digital brand objects.

## Preview on Vercel — no database required

1. Import `Mohamedd9898/Joya-website-` into Vercel.
2. Choose the **Next.js** framework and leave **Root Directory** as the repository root (`.`).
3. Use Node.js **24.x** and the default build command, `npm run build`.
4. Leave environment variables empty for the frontend preview and click **Deploy**.

Vercel is detected automatically. Without `DATABASE_URL`, all public pages use the included read-only content, local images and fonts. `/en` and `/ar` work without setting up a database. Package estimates, filters, case studies and product demos remain interactive. Contact submissions and administrator sign-in clearly report that they are unavailable in this preview; they do not pretend to save data.

To enable the real CMS and enquiry storage later, add a PostgreSQL `DATABASE_URL`, configure verified TLS and provision the owner account against that database before redeploying. Vercel's local filesystem is **not** used for persistent application data. You can force the same read-only preview locally with `JOYA_FRONTEND_PREVIEW=true`. The first deployment is a frontend review, not a configured production backend.

## Run locally

Use Node.js 24 and the existing checkout. Cloud tasks are already isolated; do not create a worktree unless explicitly requested.

```sh
npm ci --cache /tmp/joya-npm-cache --no-audit --no-fund
npm run dev
```

The application listens on port 3000. Public routes begin with `/en` or `/ar`; administration is at `/admin`. The first database connection creates the schema and seeds 18 services, 39 labelled concept projects, three editable service bundles and the global settings. The seed runs once, so restarting does not restore deleted records or overwrite edits.

Without `DATABASE_URL`, a real embedded PostgreSQL engine (PGlite) stores data in `.data/postgres`. This is intended for a single development server process. Do not run CLI database commands while that process is using the same embedded database. Stop the server first. Data and media persist across restarts.

For a network PostgreSQL deployment, set `DATABASE_URL`; set `PGSSL=require` for certificate-verified TLS. A Google Cloud Dammam deployment can use a regional PostgreSQL instance. No deployment, payment gateway or WhatsApp account is provisioned by the source code.

## Provision the owner account

No default password or public registration route exists. With the development server stopped, inject `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` (12–72 UTF-8 bytes) securely, then run:

```sh
npm run admin:create
```

The command creates or rotates the owner account. Never commit these values. Restart the application and sign in at `/admin`. Owners can add editor or owner accounts in Users. Editors can manage content and enquiries; only owners can manage users and settings. All session tokens are hashed in the database and delivered in HTTP-only SameSite=Strict cookies. Before HTTPS publication, set `COOKIE_SECURE=true` and the canonical `SITE_URL`.

## What is implemented

- Bilingual homepage, six-family service hub and 18 individual service pages.
- Portfolio filtering, 39 case studies and eight selectable material presentations per concept (312 material views), using business-appropriate physical and digital designs. Photography is mood reference, not a claim that a concept was commissioned or built.
- Six sector pages, package builder, consultation requests, contact forms and privacy page.
- Interactive loyalty, restaurant menu/pickup, WhatsApp journey, content editing and storefront demonstrations. These are explicitly marked demos: they do not create real loyalty transactions, transmit WhatsApp messages, collect payment or place orders.
- PostgreSQL-backed CMS for services, portfolio, prices, timed promotions, bundles, pages, media, consultation enquiries, leads, users and settings.
- Uploads accept verified JPEG, PNG and WebP. Media is stored in PostgreSQL; image metadata is separate from image bytes.
- Public forms persist genuine enquiries. Consultation submissions are requests, not confirmed or paid appointments. They include a preferred local Saudi session time.
- Promotion rules support percentage reductions, fixed reductions, special prices and bundle-specific rules. The lowest active applicable price wins; discounts do not stack. Expired promotions return to regular pricing at request time. Custom-quoted services retain a null price.
- Central commercial prices include the distinct logo and full-branding starting prices. Menu/item amounts shown inside product demos are illustrative and separate from JOYA service prices.
- SEO metadata, hreflang, canonical paths, OpenGraph, sitemap, robots and Organization/Service/FAQ/Breadcrumb structured data. No physical address, ratings, clients or LocalBusiness claims are invented.

## Admin usage

Edit structured English and Arabic fields, deliverables, FAQs, galleries and service relations. The design remains fixed while content changes. Use Publish/Hide, Duplicate, Delete and ordering controls in the collection lists. Prices has a focused price editor, including custom quotation and starting-price flags.

Use Pages for new text-content pages. SEO entries use stable route IDs: `home`, `services`, `work`, `packages`, or `services-websites` for `/services/websites`. Publish the entry to activate metadata overrides. Core-page visual layouts remain intentionally controlled by JOYA.

Set the real WhatsApp number, email and website URL in Settings. Until a real WhatsApp number is saved, enquiry CTAs lead to the working contact form. No fabricated phone number is shipped. The Consultation area lists requests; confirm timing and payment directly with the client.

## Verification

```sh
npm test
npm run build
```

Browser validation uses Playwright and system Chromium when available. It checks all 148 bilingual public routes, server-rendered Arabic RTL, mobile layouts, filtering, eight case-study material views, interactive demos, forms, persisted leads, authentication, access restrictions, commercial price changes, promotion expiry, portfolio CRUD and media validation.

To create an isolated temporary QA owner with the server stopped:

```sh
npx tsx scripts/test-account.ts
npm run dev
# In another terminal:
npm run test:browser
```

The QA script writes generated credentials only to `/tmp/joya-qa-access.json` with mode 0600. It does not print them. After testing, stop the server and run `npx tsx scripts/cleanup-test.ts`. Never use QA credentials for public deployment. `CHROMIUM_PATH` may override the browser executable.

## Production handoff

1. Supply the actual HTTPS domain, JOYA contact details and owner account.
2. Provision a regional PostgreSQL database with backups and verified TLS, and set `REQUIRE_EXTERNAL_DATABASE=true`. Restrict ingress and database access in the deployment platform.
3. Set `COOKIE_SECURE=true` and `SITE_URL` to the canonical HTTPS origin. Configure the reverse proxy to preserve the Host header. Configure only trusted inbound proxy headers.
4. Run `npm ci`, `npm run build`, then `npm start`. For multiple replicas use external PostgreSQL, never a shared embedded database directory.
5. Configure operator-specific privacy/retention information before collecting public enquiries. Export or migrate development content to production with reviewed database tooling; switching `DATABASE_URL` selects a separate database and does not migrate local edits automatically.
6. Connect live WhatsApp, payment and external business integrations only after the business accounts, provider scopes and credentials are supplied. The public product demonstrations remain sandboxed examples.

No hero video or WebGL payload is needed for the current direction. The restrained 3D treatment is CSS perspective on relevant branded objects, with touch and reduced-motion fallbacks. Photography and fonts are local; initial rendering does not download the full portfolio library. Source image references are recorded in `public/photography/credits.json`.
