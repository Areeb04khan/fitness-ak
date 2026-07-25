import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type ExerciseLogRow = {
  id: string;
  exercise_name: string;
  set_number: number;
  reps: number | null;
  weight: number | null;
  rpe: number | null;
  logged_at: string;
};

export const logSet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: {
      exercise_name: string;
      reps?: number;
      weight?: number;
      rpe?: number;
      set_number?: number;
      notes?: string;
    }) =>
      z
        .object({
          exercise_name: z.string().min(1).max(200),
          reps: z.number().int().min(0).max(1000).optional(),
          weight: z.number().min(0).max(9999).optional(),
          rpe: z.number().min(1).max(10).optional(),
          set_number: z.number().int().min(1).max(50).optional(),
          notes: z.string().max(500).optional(),
        })
        .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const today = new Date().toISOString().slice(0, 10);
    // find-or-create today's log
    let logId: string | undefined;
    const { data: existing } = await supabase
      .from("workout_logs")
      .select("id")
      .eq("user_id", userId)
      .eq("log_date", today)
      .limit(1)
      .maybeSingle();
    if (existing) {
      logId = existing.id;
    } else {
      const { data: created, error } = await supabase
        .from("workout_logs")
        .insert({ user_id: userId, log_date: today, day_index: (new Date().getDay() + 6) % 7 })
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      logId = created.id;
    }

    let setNumber = data.set_number;
    if (setNumber === undefined) {
      const { count } = await supabase
        .from("exercise_logs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("log_id", logId!)
        .eq("exercise_name", data.exercise_name);
      setNumber = (count ?? 0) + 1;
    }

    const { error } = await supabase.from("exercise_logs").insert({
      user_id: userId,
      log_id: logId!,
      exercise_name: data.exercise_name,
      set_number: setNumber,
      reps: data.reps ?? null,
      weight: data.weight ?? null,
      rpe: data.rpe ?? null,
      notes: data.notes ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true, set_number: setNumber };
  });

export const getProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { exercise_name?: string; limit?: number }) =>
    z.object({ exercise_name: z.string().optional(), limit: z.number().int().min(1).max(200).optional() }).parse(d),
  )
  .handler(async ({ data, context }): Promise<ExerciseLogRow[]> => {
    let q = context.supabase
      .from("exercise_logs")
      .select("id, exercise_name, set_number, reps, weight, rpe, logged_at")
      .eq("user_id", context.userId)
      .order("logged_at", { ascending: false })
      .limit(data.limit ?? 50);
    if (data.exercise_name) q = q.ilike("exercise_name", `%${data.exercise_name}%`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });
