import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PPL_PLAN } from "@/lib/ppl-plan";

/**
 * Seeds the PPL workout plan for a new user.
 * No-ops if workout_days already exist for the user.
 */
export const seedWorkoutPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { count } = await supabase
      .from("workout_days")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if ((count ?? 0) > 0) return { ok: true, seeded: false };

    const { data: days, error: e1 } = await supabase
      .from("workout_days")
      .insert(PPL_PLAN.map((d) => ({ user_id: userId, day_index: d.day_index, focus: d.focus })))
      .select("id, day_index");
    if (e1) throw new Error(e1.message);

    for (const day of days ?? []) {
      const plan = PPL_PLAN.find((d) => d.day_index === day.day_index);
      const exList = plan?.exercises ?? [];
      if (exList.length === 0) continue;
      const { error: e2 } = await supabase.from("exercises").insert(
        exList.map((ex, i) => ({
          user_id: userId,
          day_id: day.id,
          name: ex.name,
          sets: ex.sets,
          notes: ex.notes,
          sort_order: i + 1,
        })),
      );
      if (e2) throw new Error(e2.message);
    }

    return { ok: true, seeded: true };
  });
