import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { generateText, tool, stepCountIs } from "ai";
import { z } from "zod";
import { createGeminiModel } from "@/lib/ai-gateway.server";
import type { Database } from "@/integrations/supabase/types";

type Role = "user" | "assistant" | "system";
type ChatMsg = { role: Role; content: string };

function makeUserClient(token: string) {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        h.set("Authorization", `Bearer ${token}`);
        return fetch(input, { ...init, headers: h });
      },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authHeader = request.headers.get("authorization") ?? "";
        if (!authHeader.startsWith("Bearer ")) return new Response("Unauthorized", { status: 401 });
        const token = authHeader.slice("Bearer ".length);

        const body = (await request.json()) as {
          thread_id?: string;
          message?: string;
        };
        if (!body.thread_id || !body.message) {
          return new Response("Missing thread_id or message", { status: 400 });
        }

        const supabase = makeUserClient(token);
        const { data: userData, error: userErr } = await supabase.auth.getUser(token);
        if (userErr || !userData?.user) return new Response("Unauthorized", { status: 401 });
        const userId = userData.user.id;

        // Verify thread ownership
        const { data: thread } = await supabase
          .from("threads")
          .select("id, title")
          .eq("id", body.thread_id)
          .eq("user_id", userId)
          .maybeSingle();
        if (!thread) return new Response("Thread not found", { status: 404 });

        // Load history
        const { data: history } = await supabase
          .from("messages")
          .select("role, parts")
          .eq("thread_id", body.thread_id)
          .order("created_at");

        const priorMessages: ChatMsg[] = (history ?? []).map((r) => {
          const parts = r.parts as Array<{ type: string; text?: string }> | string;
          const content =
            typeof parts === "string"
              ? parts
              : Array.isArray(parts)
                ? parts.filter((p) => p.type === "text").map((p) => p.text ?? "").join("")
                : "";
          return { role: r.role as Role, content };
        });

        // Persist user message
        await supabase.from("messages").insert({
          thread_id: body.thread_id,
          user_id: userId,
          role: "user",
          parts: [{ type: "text", text: body.message }],
        });

        const model = createGeminiModel();

        const tools = {
          list_schedule: tool({
            description: "Get the user's weekly training split (7 days) with exercises for each.",
            inputSchema: z.object({}),
            execute: async () => {
              const { data: days } = await supabase
                .from("workout_days")
                .select("id, day_index, focus")
                .eq("user_id", userId)
                .order("day_index");
              const { data: ex } = await supabase
                .from("exercises")
                .select("id, day_id, name, sets, notes, sort_order")
                .eq("user_id", userId)
                .order("sort_order");
              return (days ?? []).map((d) => ({
                day_index: d.day_index,
                focus: d.focus,
                exercises: (ex ?? [])
                  .filter((e) => e.day_id === d.id)
                  .map((e) => ({ id: e.id, name: e.name, sets: e.sets, notes: e.notes })),
              }));
            },
          }),
          update_day_focus: tool({
            description: "Change the focus/title of a training day (0=Mon..6=Sun).",
            inputSchema: z.object({ day_index: z.number().int().min(0).max(6), focus: z.string() }),
            execute: async ({ day_index, focus }) => {
              const { error } = await supabase
                .from("workout_days")
                .update({ focus })
                .eq("user_id", userId)
                .eq("day_index", day_index);
              if (error) return { ok: false, error: error.message };
              return { ok: true };
            },
          }),
          add_exercise: tool({
            description: "Add an exercise to a training day. day_index 0=Mon..6=Sun. sets is a prescription like '4 × 8'.",
            inputSchema: z.object({
              day_index: z.number().int().min(0).max(6),
              name: z.string(),
              sets: z.string(),
              notes: z.string().optional(),
            }),
            execute: async ({ day_index, name, sets, notes }) => {
              const { data: day } = await supabase
                .from("workout_days")
                .select("id")
                .eq("user_id", userId)
                .eq("day_index", day_index)
                .single();
              if (!day) return { ok: false, error: "Day not found" };
              const { data: existing } = await supabase
                .from("exercises")
                .select("sort_order")
                .eq("day_id", day.id)
                .order("sort_order", { ascending: false })
                .limit(1);
              const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;
              const { data, error } = await supabase
                .from("exercises")
                .insert({
                  user_id: userId,
                  day_id: day.id,
                  name,
                  sets,
                  notes: notes ?? null,
                  sort_order: nextOrder,
                })
                .select("id")
                .single();
              if (error) return { ok: false, error: error.message };
              return { ok: true, id: data.id };
            },
          }),
          update_exercise: tool({
            description: "Update an exercise's name, prescription, or notes by id.",
            inputSchema: z.object({
              exercise_id: z.string().uuid(),
              name: z.string().optional(),
              sets: z.string().optional(),
              notes: z.string().optional(),
            }),
            execute: async ({ exercise_id, name, sets, notes }) => {
              const clean: { name?: string; sets?: string; notes?: string } = {};
              if (name !== undefined) clean.name = name;
              if (sets !== undefined) clean.sets = sets;
              if (notes !== undefined) clean.notes = notes;
              if (Object.keys(clean).length === 0) return { ok: true };
              const { error } = await supabase
                .from("exercises")
                .update(clean)
                .eq("user_id", userId)
                .eq("id", exercise_id);
              if (error) return { ok: false, error: error.message };
              return { ok: true };
            },
          }),
          remove_exercise: tool({
            description: "Delete an exercise by id.",
            inputSchema: z.object({ exercise_id: z.string().uuid() }),
            execute: async ({ exercise_id }) => {
              const { error } = await supabase
                .from("exercises")
                .delete()
                .eq("user_id", userId)
                .eq("id", exercise_id);
              if (error) return { ok: false, error: error.message };
              return { ok: true };
            },
          }),
          log_set: tool({
            description: "Log a set for today. reps required. weight in kg optional, rpe 1-10 optional.",
            inputSchema: z.object({
              exercise_name: z.string(),
              reps: z.number().int().min(0).max(1000),
              weight: z.number().min(0).max(9999).optional(),
              rpe: z.number().min(1).max(10).optional(),
            }),
            execute: async ({ exercise_name, reps, weight, rpe }) => {
              const today = new Date().toISOString().slice(0, 10);
              const { data: existing } = await supabase
                .from("workout_logs")
                .select("id")
                .eq("user_id", userId)
                .eq("log_date", today)
                .maybeSingle();
              let logId = existing?.id;
              if (!logId) {
                const { data: created, error } = await supabase
                  .from("workout_logs")
                  .insert({
                    user_id: userId,
                    log_date: today,
                    day_index: (new Date().getDay() + 6) % 7,
                  })
                  .select("id")
                  .single();
                if (error) return { ok: false, error: error.message };
                logId = created.id;
              }
              const { count } = await supabase
                .from("exercise_logs")
                .select("id", { count: "exact", head: true })
                .eq("user_id", userId)
                .eq("log_id", logId!)
                .eq("exercise_name", exercise_name);
              const setNumber = (count ?? 0) + 1;
              const { error } = await supabase.from("exercise_logs").insert({
                user_id: userId,
                log_id: logId!,
                exercise_name,
                set_number: setNumber,
                reps,
                weight: weight ?? null,
                rpe: rpe ?? null,
              });
              if (error) return { ok: false, error: error.message };
              return { ok: true, set_number: setNumber };
            },
          }),
          get_progress: tool({
            description: "Get recent logged sets, optionally filtered by exercise name.",
            inputSchema: z.object({
              exercise_name: z.string().optional(),
              limit: z.number().int().min(1).max(100).optional(),
            }),
            execute: async ({ exercise_name, limit }) => {
              let q = supabase
                .from("exercise_logs")
                .select("exercise_name, set_number, reps, weight, rpe, logged_at")
                .eq("user_id", userId)
                .order("logged_at", { ascending: false })
                .limit(limit ?? 30);
              if (exercise_name) q = q.ilike("exercise_name", `%${exercise_name}%`);
              const { data } = await q;
              return data ?? [];
            },
          }),
          list_meds: tool({
            description: "List medications and supplements.",
            inputSchema: z.object({}),
            execute: async () => {
              const { data } = await supabase
                .from("private_items")
                .select("id, name, dose, time_of_day, notes")
                .eq("user_id", userId)
                .order("sort_order");
              return data ?? [];
            },
          }),
          add_med: tool({
            description: "Add a medication or supplement.",
            inputSchema: z.object({
              name: z.string(),
              dose: z.string(),
              time_of_day: z.string(),
              notes: z.string().optional(),
            }),
            execute: async ({ name, dose, time_of_day, notes }) => {
              const { error } = await supabase.from("private_items").insert({
                user_id: userId,
                name,
                dose,
                time_of_day,
                notes: notes ?? null,
              });
              if (error) return { ok: false, error: error.message };
              return { ok: true };
            },
          }),
          remove_med: tool({
            description: "Delete a medication/supplement by id.",
            inputSchema: z.object({ id: z.string().uuid() }),
            execute: async ({ id }) => {
              const { error } = await supabase
                .from("private_items")
                .delete()
                .eq("user_id", userId)
                .eq("id", id);
              if (error) return { ok: false, error: error.message };
              return { ok: true };
            },
          }),
        };

        const system = `You are the user's personal fitness and daily-plan assistant.
You can read and modify their weekly training split, log workout sets, track progress, and manage their medication/supplement checklist — all via the tools you have.
Be concise. When the user asks for a change, do it via the appropriate tool, then confirm in one short sentence.
Today is ${new Date().toISOString().slice(0, 10)} (day index ${(new Date().getDay() + 6) % 7}, 0=Mon..6=Sun).`;

        try {
          const result = await generateText({
            model,
            system,
            messages: [...priorMessages, { role: "user", content: body.message }],
            tools,
            stopWhen: stepCountIs(20),
          });

          const reply = result.text || "(no reply)";

          await supabase.from("messages").insert({
            thread_id: body.thread_id,
            user_id: userId,
            role: "assistant",
            parts: [{ type: "text", text: reply }],
          });

          // Bump thread updated_at + auto-title first exchange
          const patch: { updated_at: string; title?: string } = { updated_at: new Date().toISOString() };
          if (thread.title === "New chat" && body.message) {
            patch.title = body.message.slice(0, 60);
          }
          await supabase.from("threads").update(patch).eq("id", body.thread_id);

          return Response.json({ reply });
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error("chat error:", msg);
          return new Response(JSON.stringify({ error: msg }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
