# GovLens India

A civic accountability platform that sets government claims beside audit findings and independent measurements, so citizens can see what was announced, what auditors found, and what surveys measured for people on the ground.

It is built on the open-source [andhbhakt](https://github.com/JCRYDER3/andhbhakt) project (MIT). This version keeps its data and structure and adds a balanced evidence layer, a wider source library and neutral wording. See [What was changed](#what-was-changed).

---

## What it does

- **Scheme scorecards** - 57 schemes with PIB claims, CAG audit findings and linked survey outcomes.
- **Trends since 2004** - 10 indicators from official sources with a band for each government term, and annual change before and since 2014.
- **Independent outcomes** - 17 NFHS-4 vs NFHS-5 indicators linked to schemes, including ones that got worse.
- **Sources** - every public source used, grouped by what it can and cannot tell you, across all parties and governments.
- **Methodology** - the rules the platform follows, and an honest list of what is not done yet.
- **State governance cards, minister profiles, manifesto tracker** - carried over from the original project.
- **Hindi and English.**

## What was changed

| Area | Change |
|---|---|
| Verdict wording | "Serious audit findings" / "Minor findings only" / "No audit data". Summaries describe the audit signal and say that audit findings alone do not show whether goals were met. |
| Long-run context | `/trends` shows indicators from 2004, banded by government term, with annual rates of change before and since 2014. |
| Independent outcomes | `/outcomes` and each scheme page show NFHS survey changes next to audit findings. |
| Sources | `/sources` lists government, audit, survey, election, manifesto and fact-check sources across the spectrum. |
| News | More outlets in the news ticker. |
| Safety | Write routes need `X-Admin-Token`. Bot-protection gates and the live AI refresh are opt-in. |
| Hosting | One Node service serves the API and the built site. |
| Database | Works with Supabase (TLS handled), creates its own tables and loads data on first start. |

## Stack

| Layer | Tech |
|---|---|
| Monorepo | pnpm workspaces |
| Runtime | Node.js 22+ , TypeScript |
| API | Express 5 (`artifacts/api-server`) |
| Frontend | React 19 + Vite + Tailwind CSS (`artifacts/govlens`) |
| Database | PostgreSQL (Supabase) + Drizzle ORM (`lib/db`) |
| Validation | Zod |
| API codegen | Orval (`lib/api-spec`) |

## Run it locally

```bash
# Needs Node 22+ and pnpm (https://pnpm.io)
pnpm install

cp .env.example .env
# edit .env and set DATABASE_URL (see below) and ADMIN_TOKEN

# build the site and the API
pnpm --filter @workspace/govlens run build
pnpm --filter @workspace/api-server run build

# start (loads .env values from your shell; the API serves the built site)
set -a; . ./.env; set +a
cd artifacts/api-server && node --enable-source-maps ./dist/index.mjs
```

Open `http://localhost:8080`. With `AUTO_SETUP_DB=true` the first start creates the tables and loads the reference data (57 schemes, 144 audit findings, 558 PIB entries, 57 state reports). Nothing is overwritten if data already exists.

For development with hot reload, run the API as above and, in another terminal, `pnpm --filter @workspace/govlens run dev` (it proxies `/api` to `localhost:8080`).

## Supabase setup

1. Create a project, then open **Connect** and copy the **Session pooler** connection string. The direct `db.<ref>.supabase.co` host is IPv6-only and fails on many networks and hosts.
2. Put it in `DATABASE_URL`. Percent-encode special characters in the password (`@` becomes `%40`).
3. Start the app. Tables are created and filled automatically. Or run `supabase/setup.sql` once in the SQL editor.

Row Level Security is switched on for every table with no public policies, so Supabase's auto-generated REST API cannot read or write them. The Node API connects with the database role and is not affected.

## Environment variables

See [`.env.example`](.env.example). The ones that matter:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (required) |
| `PORT` | API port (required) |
| `AUTO_SETUP_DB` | `true` to create tables and load data on first start |
| `ADMIN_TOKEN` | Needed for write routes and `/api/admin/*`, sent as `X-Admin-Token` |
| `ALLOWED_ORIGIN` | Optional CORS origin |
| `ENFORCE_SESSION_GATE`, `SESSION_SECRET`, `TURNSTILE_SECRET_KEY` | Optional bot-check gate |
| `ENABLE_LIVE_REFRESH` and the `AI_INTEGRATIONS_*` pair | Optional live scheme refresh |

## Deploy

Any Node host works. Example for a service host such as Render:

- Build: `pnpm install --frozen-lockfile --prod=false && pnpm --filter @workspace/govlens run build && pnpm --filter @workspace/api-server run build`
- Start: `cd artifacts/api-server && node --enable-source-maps ./dist/index.mjs`
- Env: `DATABASE_URL`, `AUTO_SETUP_DB=true`, `ADMIN_TOKEN`, `NODE_ENV=production`

A [`render.yaml`](render.yaml) with these settings is included.

## Where things live

```
artifacts/
  api-server/src/    routes, middlewares, jobs, lib/auto-setup.ts
  govlens/src/
    pages/           page components (trends, outcomes, sources, methodology, ...)
    data/            static civic data; balanced-data.ts holds trends, outcomes, sources
lib/
  db/                Drizzle schema, schema.sql, seed.sql
  api-zod/           generated Zod schemas
  api-spec/          OpenAPI spec
supabase/setup.sql   one-file schema + data for the Supabase SQL editor
```

## Data and its limits

All data comes from public documents: CAG reports, PIB releases, NFHS, MoSPI, RBI, World Bank, ECI affidavits (via ADR), party manifestos and more. See the in-app Sources page.

- Figures in `balanced-data.ts` were compiled from the cited publications. Each carries its source link. Please verify against the source before relying on them, and report errors through the in-app form.
- Survey and audit data arrive with a lag. NFHS-6 (2023-24) fact sheets were released in June 2026 and are not yet added.
- Audit findings describe how a scheme was run; they do not by themselves show whether goals were met. Stored severity labels are not CAG's own grading.
- New pages (Trends, Outcomes, Sources, Methodology) are English only; navigation and verdict text are in Hindi too.

## Contributing

1. Fork and clone.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` and `ADMIN_TOKEN`.
3. `pnpm install`, then run as above.
4. Data corrections go in `artifacts/govlens/src/data/`. Include the source URL.

## Credits and license

MIT. Based on [JCRYDER3/andhbhakt](https://github.com/JCRYDER3/andhbhakt), also MIT.
