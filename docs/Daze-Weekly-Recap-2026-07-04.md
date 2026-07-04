# Daze Weekly Recap — Week of 2026-06-28 to 2026-07-04

> **Routine instructions:** Fill each section before Angelo's Monday morning review.
> Source data: nightly overnight-dev PRs, daily QA audit PRs, and GitHub issue activity.

---

## Ships This Week

PRs merged to `main` across all four repos:

| Repo | PR | Title | Confidence |
|------|-----|-------|------------|
| daze-managementportal | #31 | feat(test): scaffold Vitest with jsdom | high |
| daze-managementportal | #32 | fix(lint): resolve 5 ESLint errors | high |
| daze-managementportal | #30 | fix(layout): fix orientationchange listener leak | high |
| daze-courier-portal | #52 | feat(courier): wire phone button to tel: link | high |
| daze-courier-portal | #53 | fix(map): memoize courierLocation for GPS-stale detection | high |
| daze-courier-portal | #56 | feat(test): scaffold Vitest in daze-courier-portal | high |
| daze-courier-portal | #47 | feat(map): smooth courier marker with linear interpolation | high |
| daze-courier-portal | #48 | feat(map): show stale GPS banner after 15s without fix | high |
| daze-beach-pool | #35 | ux(checkout): contact-field hint + blur validation | high |
| daze-beach-pool | #37 | fix: surface Supabase error in useOrderHistory | high |
| daze-beach-pool | #36 | fix(carousel): clean up reInit listener on unmount | high |

**Total ships:** 11 PRs across 3 repos.

---

## QA Findings (from daily audit PRs)

Summary of findings that are NEW, OPEN, or escalated this week:

| ID | Severity | Repo | Summary | Status |
|----|----------|------|---------|--------|
| F-233 | CRITICAL (day 5+) | daze-order-manager | `pos_configs_anon_select` exposes POS API key | **NEEDS ANGELO** — drop the policy, confirmed safe (no client-side ref) |
| F-236 | HIGH | daze-order-manager | `pos_location_map` anon SELECT USING(true) | Open — awaiting F-233 decision |
| F-239 | MEDIUM | daze-order-manager | `order_status_history` anon INSERT bypass | Open — DDL fix ready but not PR'd |
| F-237 | MEDIUM | daze-order-manager | `courier_active_order_count` anon IDOR | Open — needs refactor |
| F-228 | MEDIUM | daze-order-manager | `image_generation_jobs` cross-tenant read | Open — DDL fix documented |
| F-241 | INFO | daze-order-manager | `get_restaurant_review_stats` anon-callable SECDEF | Benign; REVOKE for hygiene |

**CRITICAL escalation: F-233 has been flagged for 5+ consecutive days.** One-liner DDL fix confirmed safe. Recommend Angelo runs:
```sql
DROP POLICY IF EXISTS pos_configs_anon_select ON public.pos_configs;
```

---

## Still In Flight (open overnight-dev PRs)

| Repo | PR | Branch | Opened | Status |
|------|-----|--------|--------|--------|
| daze-courier-portal | #57 | feat/overnight-dev-courier-position-smoothing-2026-07-03 | Jul 3 | Draft — may be duplicate of merged #47 |

**Note on PR #57:** The smoothing feature appears to have been merged earlier as commit #47. Review PR #57 before merging — it may be a no-op or a follow-up refinement.

---

## Backlog Priority Queue

For the coming week (highest priority first):

1. **[CRITICAL]** F-233: Drop `pos_configs_anon_select` — one DDL line, no app changes needed. Angelo to execute directly.
2. **[HIGH]** F-239: Restrict `osh_insert` to authenticated — prevents EOD gate bypass.
3. **[HIGH]** F-236: `pos_location_map` anon SELECT — needs owner analysis (same pattern as F-233).
4. **[P0 BACKLOG]** FUNPCB Watercrest cutover: `funpcb-watercrest.ts` tenant config not yet scaffolded in daze-beach-pool. Create the tenant file before the cashapp flag flip can land.
5. **[P0 BACKLOG]** ResortMap 8-PR plan: next PR after smoothing — review what's unstarted in `feat/3d-digital-twin`.
6. **[MEDIUM]** F-237: `courier_active_order_count` IDOR — function refactor needed.

---

## Blockers / Needs Angelo

- **F-233 DDL:** Cannot be applied by overnight-dev (DB write outside blast radius). Angelo to apply in Supabase dashboard.
- **FUNPCB tenant config:** The `funpcb-watercrest.ts` file does not exist in daze-beach-pool. Overnight-dev cannot create a tenant config from scratch without a spec. Angelo to scaffold or provide the tenant config shape.
- **PR #57 review:** Potential duplicate of merged #47 — Angelo to close or confirm before it clogs the PR queue.

---

## Metrics (this week)

| Metric | Value |
|--------|-------|
| PRs opened (overnight-dev) | ~8 |
| PRs merged | 11 |
| GitHub issues closed | 0 (all P2 — code shipped but issues left open) |
| QA findings escalated | 1 CRITICAL (F-233, day 5+) |
| Tokens used (approx, daily avg) | ~90k |
| Hard stops tripped | 0 |

---

## Template Instructions for Future Runs

This file is a **dated skeleton** meant to be committed weekly by the `Daze Weekly Recap` routine (not yet scheduled). To use:

1. Copy this file, rename to `docs/Daze-Weekly-Recap-<YYYY-MM-DD>.md`.
2. Query GitHub API for merged PRs in the past 7 days across all 4 repos.
3. Pull the latest QA finding table from the most recent `docs/QA_REPORT_*.md` in daze-order-manager.
4. List open overnight-dev PRs (filter: branch starts with `feat/overnight-dev-`).
5. Update the Backlog Priority Queue from `.platform/BACKLOG.md` or GitHub issues.
6. Fill Metrics from session heartbeat logs.
7. Commit on branch `chore/weekly-recap-<YYYY-MM-DD>`, open draft PR.

---

_Skeleton generated by Daze Overnight Dev — 2026-07-04_
_Next scheduled recap: 2026-07-11_
