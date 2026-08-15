# TruePath — Team README

This document explains how the project pieces connect, and how we work together on the same codebase without stepping on each other.

---

## 1. How Everything Connects

```
can u make this better 
┌─────────────────┐        HTTPS/JSON          ┌─────────────────┐
│    frontend/     │ ────────────────────────▶ │     backend/    │
│  Next.js (Vercel)│ ◀──────────────────────── │ Express (Render)│
└─────────────────┘        API responses       └───────────────-─┘
        │                                                │
        │ imports types/validators from                  │ imports types/validators from
        ▼                                                ▼
              ┌────────────────────────────┐
              │          shared/           │
              │  types/  +  validators/    │
              └────────────────────────────┘
                                                          │
                                                          │ reads/writes
                                                          ▼
                                                ┌──────────────────┐
                                                │     database/    │
                                                │  Supabase(Postgres)│
                                                └──────────────────┘
```

**In plain terms:**

- **`frontend/`** never talks to the database directly. It only calls the backend's API (`lib/api/client.ts` is the one place that does this).
- **`backend/`** is the only thing that talks to the database. It exposes routes like `/api/paths/:slug` that the frontend calls.
- **`shared/`** is the contract between frontend and backend — both import the same `types/` (so a `Path` object looks identical on both sides) and the same `validators/` (Zod schemas), so data is checked the same way whether it's coming from a form or hitting the API directly.
- **`database/`** holds the actual schema (`migrations/`) and the real content (`seeds/`) — e.g. the Cybersecurity roadmap content lives here as data, not as hardcoded frontend text. This is *why* adding a new path later doesn't require new code — it just requires new rows here.

**One-sentence version:** Frontend asks Backend for data → Backend asks Database → data flows back the same path → both Frontend and Backend agree on what that data looks like because they both import from `shared/`.

---

## 2. Who Owns What

| Folder | Primary owner | Touches `shared/`? |
|---|---|---|
| `frontend/` | Frontend dev | Yes — imports types/validators, doesn't edit them |
| `backend/` | Backend dev | Yes — imports types/validators, doesn't edit them |
| `shared/` | Whoever changes the data model | **Both** — this is the one folder that affects the other person's work |
| `database/` | Backend dev | No |

**Rule of thumb:** if you're about to change something in `shared/`, message the other dev first — it affects their code too.

---

## 3. Branching Strategy

We use a simple **feature branch workflow** off a single `main` branch.

```
main                 ← always stable, deployable
 ├── feature/backend-paths-api
 ├── feature/frontend-tree-ui
 ├── feature/auth-flow
 └── fix/cors-config
```

**Rules:**

1. **Never commit directly to `main`.** Always branch off it.
2. **Branch naming:** `feature/short-description` or `fix/short-description`. Keep it lowercase, hyphenated.
3. **One branch = one focused task.** Don't mix "add login page" and "fix tree styling" in the same branch — makes review and rollback harder.
4. **Open a Pull Request (PR) into `main`** when your branch is ready. Even on a small team, PRs are useful — the other dev can glance at what changed before it merges, catching accidental `shared/` breakage early.
5. **Pull `main` into your branch regularly** (`git pull origin main` while on your branch, or `git merge main`) so you're not integrating a huge diff at the end.

---

## 4. How Two Devs Work on the Same Thing Without Conflicts

The monorepo structure is designed so you naturally work in **different folders most of the time**:

- Backend dev works in `backend/` and `database/`
- Frontend dev works in `frontend/`
- Conflicts mostly happen only in `shared/`

**When both of you genuinely need the same piece (e.g. defining what a `Resource` object looks like):**

1. Agree on the shape **before** either of you starts building against it — a 5-minute call beats a merge conflict later.
2. Whoever needs it first adds it to `shared/types/` and `shared/validators/` in a small, dedicated branch (`feature/shared-resource-type`), gets a quick PR review, merges to `main` fast.
3. Both of you then pull `main` and build against the now-finalized shared type.

**Golden rule:** treat `shared/` like a shared API contract — changes there should be small, fast to review, and communicated, not silently pushed.

**Day-to-day flow for each person:**

```bash
git checkout main
git pull origin main
git checkout -b feature/your-task-name

# ...do work...

git add .
git commit -m "clear description of what changed"
git push origin feature/your-task-name

# open a PR into main on GitHub
# other dev reviews (even a quick skim) → merge
```

---

## 5. How to Add a New Career Path Later (End-to-End)

This is the real test of "expandable" — here's the exact path with no code changes required:

1. Copy `database/seeds/_template.sql` → fill in the new path's sub-paths, stages, and resources.
2. Run the migration/seed against Supabase.
3. Visit `/paths/[new-path-slug]` on the frontend — it renders automatically via the existing dynamic route.
4. Done. No new folders, no new routes, no new components.

If a new path ever needs something structurally different (e.g. a totally different UI layout), that's a real feature request — discuss before building, don't quietly diverge from the existing pattern.

---

## 6. Local Setup (fill in once environments are running)

```bash
# clone
git clone <repo-url>
cd truepath

# frontend
cd frontend && npm install && npm run dev

# backend (separate terminal)
cd backend && npm install && npm run dev
```

Environment variables needed — see `.env.example` in each of `frontend/` and `backend/`.
