# TruePath

**Structured career guidance for self-directed learners.**

TruePath is a web platform that maps out real career paths with clear, staged roadmaps — starting with Cybersecurity — so people figuring out their own direction don't have to guess where to begin, what to learn, in what order, or what it leads to.

---

## The Problem

People who leave formal education — whether by dropping out, taking a gap year, or choosing to learn independently — consistently run into the same three gaps:

- **No structure** — free, high-quality courses exist (TryHackMe, PortSwigger Academy, freeCodeCamp, countless YouTube channels), but no one tells you the right order to go through them in.
- **No mentorship** — asking for help in forums or Discord communities is hit-or-miss; answers are inconsistent, and volunteers aren't always around.
- **No clear outcome** — even when someone does start learning, it's unclear what job or role that learning actually leads to.

This isn't a niche problem. It was independently validated in two ways:

- It appears in **Razorpay's "Top 10,000 Problems of India"** initiative, ranked in the **Top 10** with a score of **88/100**.
- It was observed first-hand: someone in a cybersecurity Discord community asked how to get started and got no real answers — just random, disconnected advice. That moment is the direct origin of this project.

Existing solutions don't fully close the gap. Sites like roadmap.sh teach concepts but don't clearly show what career outcomes a path leads to, and don't go deep on paths like cybersecurity. Community help (Discord, Reddit) is inconsistent and not repeatable for the next person who asks the same question.

---

## The Solution

TruePath lays out career paths as structured, staged journeys instead of flat lists of topics. For every path, it answers the four questions a self-directed learner usually has no one to ask:

1. **What is this path actually about?** — plain-language explanation of the field
2. **What do I need to know before I start?** — explicit prerequisites, not assumed knowledge
3. **What do I study, in what order, from where?** — a staged roadmap built from free and open-source resources
4. **What can I become after this?** — real job roles and what to apply for once you're ready

The platform is built to expand — new career paths can be added as content without changing the underlying structure. The current MVP focuses on a single path, **Cybersecurity**, chosen because it's where the founding team has the most direct expertise and where the problem was first observed.

---

## How It Works

- **Browse freely, no login required.** Anyone can view a full path — the roadmap, stages, prerequisites, and resources — before ever signing up. The goal is to give real value first, not gate information behind a wall.
- **Log in to track progress.** Creating an account lets you mark stages and resources as complete, and see where you are on your path over time.
- **Cybersecurity sub-paths** cover different specializations — Red Team, Blue Team, AppSec, Cloud Security, and GRC — each with its own staged roadmap from foundations to job-readiness.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (React), Tailwind CSS — deployed on Vercel |
| Backend | Node.js + Express — deployed on Render |
| Database | Supabase (Postgres) |
| Auth | Supabase Auth |

Frontend and backend are separated (not a single unified Next.js app) so each can be developed, deployed, and scaled independently.

---

## Project Status

Currently in active development as an MVP, built as a research project focused on solving a validated, real-world problem — not just a course assignment. The Cybersecurity path is the first fully built-out path; additional paths (Web Development, Data Science, and others) are planned once the core platform and content model are proven out.

---

## Who This Is For

Anyone figuring out where to start and how — whether you left formal education, are studying alongside it, or are pivoting into a new field entirely. There's no age or background requirement; the only thing you need is the willingness to learn on your own terms.


## Folder Tree Structure 
TruePath/
├── .github/
│   └── workflows/                    # CI checks (lint/build) before deploy — optional but good habit
│
├── frontend/                         # Next.js App Router → Vercel
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx    # User progress overview
│   │   │   └── layout.tsx
│   │   ├── paths/
│   │   │   ├── page.tsx              # Paths directory (all top-level paths)
│   │   │   └── [pathSlug]/
│   │   │       ├── page.tsx          # Path overview page
│   │   │       └── [subPathSlug]/
│   │   │           └── page.tsx      # Sub-path page — stages/resources shown as sections here
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── ui/                       # Low-level reusable elements (buttons, badges, modals)
│   │   ├── auth/                     # LoginForm, UserMenu
│   │   ├── path-tree/                # TreeView, PathNode, SubPathNode, StageSection, ResourceItem
│   │   └── layout/                   # Navbar, Footer
│   ├── lib/
│   │   ├── api/client.ts             # Typed fetch wrapper calling the backend
│   │   ├── auth/session.ts           # Client-side token/session handling
│   │   └── hooks/                    # useProgress, useTree, etc.
│   ├── public/
│   │   ├── icons/
│   │   └── images/
│   ├── .env.example                  # NEXT_PUBLIC_API_URL=...
│   ├── next.config.mjs
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/                          # Express API → Render
│   ├── src/
│   │   ├── config/                   # Env vars, Supabase client init
│   │   ├── routes/
│   │   │   ├── paths.route.ts        # /api/paths, /api/paths/:slug (generic — works for any path)
│   │   │   ├── progress.route.ts     # User progress endpoints (auth required)
│   │   │   └── auth.route.ts         # Login/signup passthrough to Supabase Auth
│   │   ├── controllers/
│   │   │   ├── paths.controller.ts   # Handles request/response, calls models directly
│   │   │   ├── progress.controller.ts
│   │   ├── models/                   # DB query functions (path, subPath, stage, resource)
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    # Verifies Supabase token
│   │   │   ├── cors.middleware.ts    # Allows only the Vercel frontend origin
│   │   │   └── error.middleware.ts
│   │   └── server.ts                 # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                           # Used by both frontend and backend
│   ├── types/
│   │   └── paths.ts                  # Path, SubPath, Stage, Resource interfaces
│   └── validators/
│       └── paths.schema.ts           # Zod schemas — validates data shape before it hits the DB
│
├── database/                         # Schema + content, decoupled from backend code
│   ├── migrations/
│   │   └── 001_create_paths_schema.sql
│   └── seeds/
│       ├── cybersecurity.sql         # MVP content
│       └── _template.sql             # Copy this to add any new path later
│
├── .gitignore
├── package.json                      # Root workspace scripts (e.g. run both dev servers)
└── README.md                         # Setup + "how to add a new path" instructions