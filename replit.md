# AuditOS

A full-stack audit management platform for accounting firms operating in East Africa (Tanzania/NBAA context). Used by audit partners, managers, and seniors to manage engagements, review GL anomalies, track findings, maintain working papers, and coordinate client data requests — with Anthropic AI assistance built in.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/audit-os run dev` — run the React frontend (port 22337)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed` — seed database with realistic Tanzania audit firm data
- Required env: `DATABASE_URL`, `AI_INTEGRATIONS_ANTHROPIC_BASE_URL`, `AI_INTEGRATIONS_ANTHROPIC_API_KEY`, `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, wouter, TanStack Query, Tailwind CSS, shadcn/ui, Recharts
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (lib/db)
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec at lib/api-spec/openapi.yaml)
- AI: Anthropic claude-opus-4-5 via Replit AI Integrations (lib/integrations-anthropic-ai)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas (do not edit manually)
- `lib/api-client-react/src/generated/api.ts` — generated TanStack Query hooks (do not edit manually)
- `lib/db/src/schema/` — Drizzle table definitions (staff, clients, engagements, anomalies, findings, working-papers, data-room)
- `artifacts/api-server/src/routes/` — Express route handlers (one file per entity)
- `artifacts/audit-os/src/pages/` — React page components (one file per page)
- `artifacts/audit-os/src/components/layout/` — Sidebar and MainLayout
- `scripts/src/seed.ts` — seed script with realistic Tanzania audit firm data

## Architecture decisions

- Contract-first API design: OpenAPI spec drives Zod validation schemas and React Query hooks via Orval codegen. Never write raw fetch calls in the frontend.
- AI features are POST endpoints (not GET) on entity sub-routes (`/anomalies/:id/analyze`, `/working-papers/:id/draft`) — they mutate the entity and return the AI result inline.
- `numeric` Drizzle columns (for USD amounts) use `doublePrecision` instead — avoids the string/number type mismatch between Drizzle and the OpenAPI-generated Zod schemas.
- `findingRef` (e.g., FIND-001) is auto-generated server-side; it is not required in the request body.
- After running codegen, if `lib/api-zod/src/index.ts` gains stale exports, manually reset it to `export * from "./generated/api";` only — Orval's `clean: true` only cleans the `generated/` subfolder, not the workspace barrel.

## Product

**Dashboard**: Firm-wide KPI cards (active engagements, unreviewed anomalies, open findings, WP pending sign-off), recent findings, recent GL anomalies.

**Engagements**: Full audit engagement lifecycle (planning → fieldwork → review → completed). Risk badges, materiality, client linkage.

**GL Anomalies**: Review queue of flagged journal entries (round numbers, weekend entries, duplicates, outliers, reversals, sequence gaps). AI deep-dive analysis via Anthropic.

**Findings**: Formal audit findings with ISA/NBAA references, management response workflow, risk badges, status tracking.

**Working Papers**: WP register grouped by section (planning/controls/substantive), status workflow (draft → prepared → reviewed → signed off), AI drafting via Anthropic.

**Clients**: Client master with TIN, industry, entity type, financial year-end, contact details.

**Data Room**: Document request tracker with categories, status badges (requested/received/reviewed/queried).

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do NOT run `pnpm dev` at workspace root — use restart_workflow or the workflow panel.
- After schema changes, always run `pnpm --filter @workspace/db run push` and restart the API server.
- After OpenAPI spec changes, always run `pnpm --filter @workspace/api-spec run codegen` then reset the api-zod barrel if needed.
- The API server bundles at startup (`pnpm run build` inside dev script) — restart the workflow to pick up code changes.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
