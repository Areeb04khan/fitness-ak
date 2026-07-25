
## What changes

1. **Light theme overhaul** — swap the current dark "Charcoal & Ember" palette in `src/styles.css` for a white / off-white surface with high-contrast text and an ember accent. Rebuild the uploaded `workout.html` as a real React page in the same light theme.

2. **Move to Lovable Cloud** — the training split, exercises, and workout logs move from static `plan-data.ts` into Postgres so the chatbot can actually edit them. Add simple email-password auth (single user — you) so rows are scoped and RLS works correctly. The old shared-password gate is replaced by real login.

3. **Threaded chat with Gemini tool-calling** — the assistant gets tools it can call to read/write your data. You'll be able to say "swap barbell rows for chest-supported rows on pull day" or "log today's bench: 4x8 at 80kg" or "show my squat progress" and it does it.

## Database (new tables, all RLS-scoped to `auth.uid()`)

```text
workout_days       one row per weekday slot (0=Mon..6=Sun) with focus label
exercises          exercises belonging to a workout_day (name, sets, notes, order)
workout_logs       a completed session (date, day_index, notes)
exercise_logs      sets logged per exercise (reps, weight, rpe, exercise_id, log_id)
private_items      medications/supplements (name, dose, time, notes)
threads            chat threads (title, updated_at)
messages           chat messages per thread (role, content, parts jsonb)
```

Seeded from the current `WEEKLY_SPLIT` + `PRIVATE_ITEMS` on first login.

## Routes

```text
/                    My Day (today's training pulled from DB, water, private checklist, weather)
/workout             Full 4-week / PPL tracker (replaces /workout.html) — light theme, sets logged to DB
/kitchen             Mom's Kitchen (unchanged, still static rotation)
/auth                Sign in / sign up (email + password)
/chat                Threaded assistant — thread list + /chat/$threadId
```

Meds/supplements no longer need a separate password gate — they're behind auth like everything else.

## Chatbot tools (server-side, RLS-scoped)

- `list_schedule` — current weekly split
- `update_exercise` / `add_exercise` / `remove_exercise` — CRUD on a day
- `replace_day` — swap out a whole day's plan
- `log_workout` — record sets/reps/weight for today
- `get_progress` — return recent history for an exercise or day
- `list_meds` / `update_med` — meds/supplements CRUD

Model: `google/gemini-3.6-flash` via Lovable AI Gateway (streaming, `stepCountIs(50)`). Tools that mutate data confirm inline in the UI before running.

## Out of scope for this build

- PWA / push notifications
- Grocery list generator
- Hindi toggle
- PDF export

Happy to add any of these after the core is working.

## Technical notes

- TanStack Start server functions for all DB access + AI calls.
- AI SDK (`streamText`, `tool()`, `useChat`) — no hand-rolled fetch.
- `chat.functions.ts` (Gemini via raw fetch) gets deleted; replaced by `/api/chat` server route.
- The old `SESSION_SECRET` / `SITE_PASSWORD` gate is removed.
- Threaded chat routes: `/chat` (list) + `/chat/$threadId` (dedicated URL per thread).

Confirm and I'll start building.
