import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type ScheduleDay = {
  id: string;
  day_index: number;
  focus: string;
  exercises: Array<{
    id: string;
    name: string;
    sets: string;
    notes: string | null;
    sort_order: number;
  }>;
};

export const getSchedule = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ScheduleDay[]> => {
    const { supabase, userId } = context;
    const { data: days, error: e1 } = await supabase
      .from("workout_days")
      .select("id, day_index, focus")
      .eq("user_id", userId)
      .order("day_index");
    if (e1) throw new Error(e1.message);

    const { data: ex, error: e2 } = await supabase
      .from("exercises")
      .select("id, day_id, name, sets, notes, sort_order")
      .eq("user_id", userId)
      .order("sort_order");
    if (e2) throw new Error(e2.message);

    return (days ?? []).map((d) => ({
      id: d.id,
      day_index: d.day_index,
      focus: d.focus,
      exercises: (ex ?? [])
        .filter((e) => e.day_id === d.id)
        .map((e) => ({
          id: e.id,
          name: e.name,
          sets: e.sets,
          notes: e.notes,
          sort_order: e.sort_order,
        })),
    }));
  });

export const updateDayFocus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { day_index: number; focus: string }) =>
    z.object({ day_index: z.number().int().min(0).max(6), focus: z.string().min(1).max(200) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("workout_days")
      .update({ focus: data.focus })
      .eq("user_id", context.userId)
      .eq("day_index", data.day_index);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const addExercise = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { day_index: number; name: string; sets: string; notes?: string }) =>
    z
      .object({
        day_index: z.number().int().min(0).max(6),
        name: z.string().min(1).max(200),
        sets: z.string().min(1).max(100),
        notes: z.string().max(500).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: day, error: e1 } = await supabase
      .from("workout_days")
      .select("id")
      .eq("user_id", userId)
      .eq("day_index", data.day_index)
      .single();
    if (e1 || !day) throw new Error(e1?.message ?? "Day not found");

    const { data: existing } = await supabase
      .from("exercises")
      .select("sort_order")
      .eq("day_id", day.id)
      .order("sort_order", { ascending: false })
      .limit(1);
    const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;

    const { data: inserted, error } = await supabase
      .from("exercises")
      .insert({
        user_id: userId,
        day_id: day.id,
        name: data.name,
        sets: data.sets,
        notes: data.notes ?? null,
        sort_order: nextOrder,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: inserted.id };
  });

export const updateExercise = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { exercise_id: string; name?: string; sets?: string; notes?: string }) =>
    z
      .object({
        exercise_id: z.string().uuid(),
        name: z.string().min(1).max(200).optional(),
        sets: z.string().min(1).max(100).optional(),
        notes: z.string().max(500).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const patch: Record<string, unknown> = {};
    if (data.name !== undefined) patch.name = data.name;
    if (data.sets !== undefined) patch.sets = data.sets;
    if (data.notes !== undefined) patch.notes = data.notes;
    if (Object.keys(patch).length === 0) return { ok: true };
    const { error } = await context.supabase
      .from("exercises")
      .update(patch)
      .eq("user_id", context.userId)
      .eq("id", data.exercise_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeExercise = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { exercise_id: string }) => z.object({ exercise_id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("exercises")
      .delete()
      .eq("user_id", context.userId)
      .eq("id", data.exercise_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
