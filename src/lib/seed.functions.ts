import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Workout plan Block A — sourced from newfiles/new1/data.js
// DB day_index uses 0=Mon..6=Sun (data.js used 0=Sun..6=Sat JS getDay())
// Conversion applied: dbDay = (jsDay + 6) % 7

const WORKOUT_DAYS = [
  { day_index: 0, focus: "Upper — Strength" },   // Monday
  { day_index: 1, focus: "Lower — Strength" },    // Tuesday
  { day_index: 2, focus: "Push — Hypertrophy" },  // Wednesday
  { day_index: 3, focus: "Boxing" },               // Thursday
  { day_index: 4, focus: "Pull — Hypertrophy" },  // Friday
  { day_index: 5, focus: "Legs — Pump" },         // Saturday
  { day_index: 6, focus: "Rest" },                 // Sunday
];

// Key = DB day_index (0=Mon..6=Sun)
const EXERCISES_BLOCK_A: Record<number, string[]> = {
  0: [
    "Barbell Bench Press — 4×5–6",
    "Barbell Row — 4×5–6",
    "Overhead Press — 3×6–8",
    "Weighted Pull-up / Lat Pulldown — 3×6–8",
    "Dips or Close-Grip Bench Press — 3×8",
  ],
  1: [
    "Back Squat — 4×5–6",
    "Romanian Deadlift — 3×6–8",
    "Leg Press — 3×8",
    "Standing Calf Raise — 4×8–10",
  ],
  2: [
    "Incline Dumbbell Press — 4×8–10",
    "Seated DB Shoulder Press — 3×10",
    "Cable Fly — 3×12",
    "Lateral Raise — 3×15",
    "Triceps Pushdown — 3×12",
  ],
  3: [
    "Shadow boxing — 3×3min",
    "Pad work / heavy bag combos — 5×3min",
    "Footwork drills — 10min",
    "Core circuit (plank, rotational throws, hanging leg raises) — 3 rounds",
  ],
  4: [
    "Pull-up / Lat Pulldown — 4×8–10",
    "Seated Cable Row — 3×10",
    "Face Pull — 3×15",
    "Barbell / DB Curl — 3×10",
    "Hammer Curl — 3×12",
  ],
  5: [
    "Leg Extension — 3×15",
    "Leg Curl — 3×15",
    "Bulgarian Split Squat — 3×10–12/leg",
    "Hip Thrust — 3×10–12",
    "Seated Calf Raise — 4×15",
  ],
  6: [], // Rest day
};

function parseExercise(str: string): { name: string; sets: string } {
  // Format: "Exercise Name — SetsPrescription"
  const idx = str.lastIndexOf(" — ");
  if (idx === -1) return { name: str, sets: "" };
  return { name: str.slice(0, idx), sets: str.slice(idx + 3) };
}

/**
 * Seeds the Block A workout plan for a new user.
 * No-ops if workout_days already exist for the user.
 */
export const seedWorkoutPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Check if already seeded
    const { count } = await supabase
      .from("workout_days")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if ((count ?? 0) > 0) return { ok: true, seeded: false };

    // Insert workout days
    const { data: days, error: e1 } = await supabase
      .from("workout_days")
      .insert(WORKOUT_DAYS.map((d) => ({ ...d, user_id: userId })))
      .select("id, day_index");
    if (e1) throw new Error(e1.message);

    // Insert exercises for each day
    for (const day of days ?? []) {
      const exList = EXERCISES_BLOCK_A[day.day_index] ?? [];
      if (exList.length === 0) continue;
      const toInsert = exList.map((str, i) => {
        const { name, sets } = parseExercise(str);
        return {
          user_id: userId,
          day_id: day.id,
          name,
          sets,
          sort_order: i + 1,
        };
      });
      const { error: e2 } = await supabase.from("exercises").insert(toInsert);
      if (e2) throw new Error(e2.message);
    }

    return { ok: true, seeded: true };
  });
