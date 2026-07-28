# AGENTS.md — Daily Plan

Guidelines for AI coding agents (Replit Agent, GitHub Copilot, Claude, GPT, etc.)
working in this repository.

## Project overview

**Daily Plan** is a personal fitness and daily-planning web app built with:
- **TanStack Start** (React 19, SSR, file-based routing via `src/routes/`)
- **Tailwind CSS v4** + **shadcn/ui** components (`src/components/ui/`)
- **Supabase** for authentication and PostgreSQL database
- **Google Gemini 2.5 Flash** via `@ai-sdk/google` for the AI chat assistant
- **Bun** as the package manager (use `bun add`, never `npm install`)

## Key rules

1. **Never force-push or rebase published history.** This repo is mirrored on
   Lovable; rewriting shared history breaks that link permanently.

2. **Use Bun for all package management.**
   ```
   bun add <package>       # install
   bun remove <package>    # uninstall
   bun run dev             # start dev server (port 5000)
   ```

3. **File-based routing** — TanStack Router auto-generates `src/routeTree.gen.ts`
   from files in `src/routes/`. Never edit `routeTree.gen.ts` manually unless
   the plugin has not yet regenerated it.

4. **Environment variables** — All secrets live in Replit Secrets.
   Required keys:
   - `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `GOOGLE_GENERATIVE_AI_API_KEY`

5. **Server vs client code** — Files suffixed `.server.ts` run only on the
   server. Client-side Supabase: `src/integrations/supabase/client.ts`.
   Server-side auth middleware: `src/integrations/supabase/auth-middleware.ts`.

6. **Do not touch** `src/integrations/supabase/client.ts`,
   `src/integrations/supabase/auth-middleware.ts`, or
   `src/integrations/supabase/auth-attacher.ts` — these are auto-generated
   Supabase integration files.

7. **Workout seeding** — `src/lib/seed.functions.ts` seeds Block A exercises
   for new users on first login. Block B data should be added here when
   implementing the switchable plan feature.

8. **AI chat** — The chat API is in `src/routes/api/chat.ts`. It uses
   `generateText` (not streaming). The model is `google("gemini-2.5-flash")`
   via `src/lib/ai-gateway.server.ts`.

9. **IPR** — All code and content belong to Areeb Khan. Do not suggest
   open-sourcing, re-licensing, or sharing without the owner's explicit consent.

## Directory structure

```
src/
  components/       Shared UI components (AppNav, Footer, WaterTracker, etc.)
  integrations/
    supabase/       Auto-generated Supabase client, types, and middleware
  lib/              Server functions (schedule, threads, meds, seed, logs)
  routes/
    __root.tsx      Root layout (QueryClient, global Footer)
    auth.tsx        Public sign-in / sign-up page
    demo.tsx        Public demo page (no login required)
    kitchen.tsx     Public meal preview page
    _authenticated/ Protected routes (/, /workout, /chat)
    api/chat.ts     Gemini AI chat endpoint
public/             Static assets served as-is
```

## Running locally

```bash
bun install
bun run dev        # → http://localhost:5000
```
