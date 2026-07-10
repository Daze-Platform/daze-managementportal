# Daze Weekly Recap — Week of 2026-07-07 to 2026-07-10

> **Routine instructions:** Fill each section before Angelo's Monday morning review.
> Source data: nightly overnight-dev PRs, daily QA audit PRs, and GitHub issue activity.

---

## Ships This Week

PRs merged to `main` across all four repos (2026-07-07 through 2026-07-10):

| Repo | PR | Title | Confidence |
|------|-----|-------|------------|
| daze-managementportal | #35 | fix(hooks): add tenantId to moveOrder and removeOrder useCallback deps | high |
| daze-managementportal | #36 | fix(hooks): fix orientationchange listener leak in useFullScreenScroll | high |
| daze-order-manager | #71 | fix(hooks): fix orientationchange listener leak + remove console.log | high |

**Total ships:** 3 PRs across 2 repos. Light week on merges — 8 PRs are queued and awaiting Angelo's review (see "Still In Flight" below).

---

## QA Findings (from daily audit PRs)

| ID | Severity | Repo | Summary | Status |
|----|----------|------|---------|--------|
| F-233 | **CRITICAL (day 12+)** | daze-order-manager | `pos_configs_anon_select` exposes POS API key to anon callers | **NEEDS ANGELO** — one DDL line, confirmed safe to drop |
| F-236 | HIGH | daze-order-manager | `pos_location_map` anon SELECT USING(true) | Open — same pattern as F-233 |
| F-239 | MEDIUM | daze-order-manager | `order_status_history` anon INSERT bypass | Open — DDL fix ready but not PR'd |
| F-237 | MEDIUM | daze-order-manager | `courier_active_order_count` anon IDOR | Open — needs refactor |
| F-228 | MEDIUM | daze-order-manager | `image_generation_jobs` cross-tenant read | Open — DDL fix documented |
| F-241 | INFO | daze-order-manager | `get_restaurant_review_stats` anon-callable SECDEF | Benign; REVOKE for hygiene |

**CRITICAL escalation: F-233 has been open for 12+ days.** The fix is a single SQL line:
```sql
DROP POLICY IF EXISTS pos_configs_anon_select ON public.pos_configs;
```
This can be run directly in the Supabase dashboard. No app-side changes needed — confirmed no client-side references to this policy.

---

## Still In Flight (open overnight-dev + nightly repair PRs)

| Repo | PR | Title | Opened | Labels | Note |
|------|-----|-------|--------|--------|------|
| daze-beach-pool | #46 | feat(funpcb): flip demoCashAppPay to false | 2026-07-09 | pm-awaits-angelo-merge, pm-needs-attention | P0 — FUNPCB prod cutover |
| daze-beach-pool | #45 | ux(checkout): fix tip label + remove $0 delivery fee | 2026-07-07 | pm-awaits-angelo-merge, code-review-clean | P2 — code-review-clean ✓ |
| daze-beach-pool | #43 | feat(cart): add confirmation dialog before clearing cart | 2026-07-06 | pm-awaits-angelo-merge, code-review-findings | P2 — review findings posted |
| daze-beach-pool | #42 | feat(ux): wire real DB order status to OrderSuccessPage | 2026-07-05 | pm-awaits-angelo-merge, code-review-findings | P1 — oldest open PR in beach-pool |
| daze-courier-portal | #59 | feat(map): show GPS accuracy circle around courier marker | 2026-07-08 | pm-awaits-angelo-merge | P0 — ResortMap plan PR 4 |
| daze-courier-portal | #57 | feat(map): courier position smoothing via linear interpolation | 2026-07-03 | pm-awaits-angelo-merge, pm-needs-attention | Possible duplicate of merged #47 |
| daze-managementportal | #40 | chore: Tier 1 nightly repair — ESLint, Fragment key, carousel | 2026-07-10 | pm-ready-to-merge, pm-awaits-angelo-merge | Code-clean ✓, ready to merge today |
| daze-managementportal | #34 | docs(recap): add weekly recap skeleton (week of 2026-07-04) | 2026-07-04 | pm-awaits-angelo-merge | Prior week's recap — still valid reference |

**8 PRs awaiting Angelo's review.** Recommended merge order:
1. **#40** (managementportal nightly repair) — code-review-clean, mechanical fixes only, zero risk
2. **#45** (beach-pool tip label) — code-review-clean, 15-line copy-only change
3. **#46** (beach-pool FUNPCB cashapp) — P0 prod cutover; verify in prod before merging
4. **#42** (beach-pool OrderSuccessPage) — P1 correctness fix (removes fake timer)
5. **#43** (beach-pool cart confirmation) — P2, has code-review findings to address first
6. **#59** (courier GPS circle) — P0 ResortMap; independent of #57
7. **#57** (courier smoothing) — **review before merging**: likely a no-op vs merged #47
8. **#34** (managementportal 2026-07-04 recap) — doc-only, merge as reference archive

---

## Backlog Priority Queue

For the coming week (highest priority first):

1. **[CRITICAL]** F-233: Drop `pos_configs_anon_select` — Angelo to execute the DDL directly in Supabase dashboard (12+ days open)
2. **[HIGH]** F-239: Restrict `order_status_history` anon INSERT — prevents EOD gate bypass
3. **[HIGH]** F-236: `pos_location_map` anon SELECT USING(true) — same pattern as F-233
4. **[P0 BACKLOG]** ResortMap 8-PR plan: PRs 1–4 are shipped or in flight; PR 5+ still unstarted. Next candidate: heading/bearing indicator on courier marker (bearing is already in the hook)
5. **[P1 BACKLOG]** daze-beach-pool #42 (OrderSuccessPage DB status) — merge unblocks guest UX on order tracking
6. **[MEDIUM]** F-237: `courier_active_order_count` IDOR — function refactor needed

---

## Blockers / Needs Angelo

- **F-233 DDL:** Cannot be applied by overnight-dev (DB write outside blast radius). Angelo to apply in Supabase dashboard — has been escalated for 12+ days.
- **PR #57 (courier smoothing):** Labeled `pm-needs-attention` — likely a duplicate of merged PR #47. Angelo should close #57 or confirm it adds something new before it clogs the merge queue.
- **PR #43 code-review findings:** Code Review Bot posted findings — overnight-dev did not address them (out of scope for the original change). Angelo to review and either address inline or open a follow-up ticket.
- **PR #46 post-merge verification:** FUNPCB Watercrest Cash App Pay must be tested in production after merge. Manual step: open the guest ordering surface and confirm the real Square Cash App Pay button renders.

---

## Metrics (this week)

| Metric | Value |
|--------|-------|
| PRs opened (overnight-dev + nightly repair) | ~5 |
| PRs merged | 3 |
| PRs queued awaiting Angelo | 8 |
| GitHub issues resolved (merged to main) | 2 (issue #33 and #50 — both shipped in prior week, issues may still be open) |
| QA findings escalated | 1 CRITICAL (F-233, day 12+) |
| Tokens used (approx, this run) | ~180k |
| Hard stops tripped | 0 |

---

## Signals & Observations

- **Merge queue at 8 PRs** — the highest it's been. Most PRs are low-risk; a 30-minute review session would clear 6 of 8. Recommend dedicating one morning slot this week to batch-merging.
- **ResortMap progress:** 4 of 8 planned PRs are shipped or in flight. Heading indicator (bearing) is the natural next PR — the field is already collected in the hook.
- **Vitest coverage growing:** Both daze-courier-portal and daze-managementportal now have test suites with real unit tests. daze-beach-pool and daze-order-manager still have no test framework.
- **Nightly repair routine active:** The `chore/repair-nightly-*` branches indicate a separate repair sweep routine is running alongside overnight-dev. PR #40 is its first merged-eligible output — code-review-clean.

---

## Template Instructions for Future Runs

This file is a **dated recap** for the week of 2026-07-07 to 2026-07-10. The `Daze Weekly Recap` routine should:

1. Copy this file, rename to `docs/Daze-Weekly-Recap-<YYYY-MM-DD>.md` (Friday's date).
2. Query GitHub API for merged PRs in the past 7 days across all 4 repos.
3. Pull the latest QA finding table from daze-order-manager daily audit reports.
4. List all open PRs with `pm-awaits-angelo-merge` label, sorted by age.
5. Update the Backlog Priority Queue from GitHub issues with `pm-agent-backlog` label.
6. Fill Metrics from session heartbeat logs.
7. Commit on branch `feat/overnight-dev-weekly-recap-<YYYY-MM-DD>`, open draft PR.

---

_Recap generated by Daze Overnight Dev — 2026-07-10_
_Next scheduled recap: 2026-07-17_
