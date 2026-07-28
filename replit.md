# Daily Plan

A personal fitness & daily planning app built with TanStack Start (React + SSR), Tailwind CSS v4, shadcn/ui, and Supabase.

## Stack

- **Framework**: TanStack Start (React 19, SSR, file-based routing)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Database & Auth**: Supabase (PostgreSQL + RLS)
- **AI**: Google Gemini 2.5 Flash via `@ai-sdk/google`
- **Package manager**: Bun

## Running the app

```
bun run dev
```

Starts the dev server on port 5000.

## Environment variables

| Key | Where set | Purpose |
|-----|-----------|---------|
| `SUPABASE_URL` | Replit shared env | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Replit shared env | Supabase anon/publishable key |
| `VITE_SUPABASE_URL` | Replit shared env | Same URL, exposed to client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Replit shared env | Same key, exposed to client |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Replit secret | Gemini API key for the chatbot |

## Features

- **My Day** — today's training focus, meals, water tracker, meds checklist, weather
- **Workout tracker** — weekly split, log sets, track progress
- **AI Chat** — Gemini-powered assistant that can update the workout plan and log sets via natural language
- **Kitchen** — meal rotation (public, no login required)

## Workout data

The workout plan (Block A) is auto-seeded from `src/lib/seed.functions.ts` on first login. It populates the Supabase `workout_days` and `exercises` tables for the authenticated user.

## User preferences

- Keep the existing TanStack Start + Supabase + Bun stack — do not migrate
- Original project connected to Lovable; keep commit history intact (no force pushes)
