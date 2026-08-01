// Push | Pull | Legs — one-month block.
// Source: ppl-workout-tracker.html. day_index: 0 = Monday … 6 = Sunday.

export type PlanExercise = { name: string; sets: string; notes: string };
export type PlanDay = { day_index: number; focus: string; exercises: PlanExercise[] };

export const PPL_PLAN: PlanDay[] = [
  {
    day_index: 0,
    focus: "Push — Chest + Arms",
    exercises: [
      { name: "Barbell Bench Press", sets: "4 × 6–8", notes: "W1 28kg → W3 32kg · rest 2 min" },
      { name: "Dumbbell Incline Press", sets: "3 × 8", notes: "W1 12kg → W3 14kg each hand · rest 90 sec" },
      { name: "Barbell Curl", sets: "3 × 6–8", notes: "W1 16kg → W3 18kg · rest 90 sec" },
      { name: "Tricep Rope Pushdown", sets: "3 × 8–10", notes: "W1 20kg → W3 24kg · rest 60 sec" },
    ],
  },
  {
    day_index: 1,
    focus: "Pull — Back + Biceps",
    exercises: [
      { name: "Barbell Bent-Over Row", sets: "4 × 8", notes: "W1 32kg → W3 36kg · rest 90 sec" },
      { name: "Lat Pulldown", sets: "3 × 8–10", notes: "W1 40kg → W3 48kg · rest 75 sec" },
      { name: "Dumbbell Bicep Curl", sets: "3 × 8–10", notes: "W1 10kg → W3 11kg each hand · rest 75 sec" },
      { name: "Face Pulls", sets: "3 × 12–15", notes: "W1 10kg → W3 12kg · rest 45 sec" },
    ],
  },
  {
    day_index: 2,
    focus: "Legs",
    exercises: [
      { name: "Barbell Back Squat", sets: "4 × 6–8", notes: "W1 40kg → W3 47kg · rest 2 min" },
      { name: "Leg Press", sets: "3 × 8–10", notes: "W1 70kg → W3 85kg · rest 90 sec" },
      { name: "Leg Extension", sets: "3 × 10–12", notes: "W1 40kg → W3 50kg · rest 60 sec" },
      { name: "Standing Calf Raise", sets: "3 × 10–12", notes: "W1 30kg → W3 37kg · rest 45 sec" },
    ],
  },
  {
    day_index: 3,
    focus: "Rest — walk, stretch, sleep",
    exercises: [
      { name: "Easy walk", sets: "30–45 min", notes: "Zone 1–2, nasal breathing" },
      { name: "Foam roll + stretch", sets: "15 min", notes: "Hips, hamstrings, chest, lats" },
    ],
  },
  {
    day_index: 4,
    focus: "Upper — Shoulders + Triceps",
    exercises: [
      { name: "Barbell Military Press", sets: "4 × 6–8", notes: "W1 20kg → W3 23kg · rest 90 sec" },
      { name: "Dumbbell Shoulder Press", sets: "3 × 8–10", notes: "W1 10kg → W3 11kg each hand · rest 75 sec" },
      { name: "Lateral Raise", sets: "3 × 10–12", notes: "W1 5kg → W3 6kg each hand · rest 60 sec" },
      { name: "Rope Tricep Extension (Overhead)", sets: "3 × 10–12", notes: "W1 18kg → W3 21kg · rest 60 sec" },
    ],
  },
  {
    day_index: 5,
    focus: "Lower — Isolation / Pump",
    exercises: [
      { name: "Leg Curl", sets: "4 × 10–12", notes: "W1 35kg → W3 42kg · rest 60 sec" },
      { name: "Leg Extension", sets: "3 × 12–15", notes: "W1 30kg → W3 38kg · rest 45 sec" },
      { name: "Bulgarian Split Squat", sets: "3 × 10 / leg", notes: "W1 10kg → W3 11kg each hand · rest 75 sec" },
      { name: "Seated Calf Raise", sets: "3 × 15", notes: "W1 25kg → W3 30kg · rest 45 sec" },
    ],
  },
  {
    day_index: 6,
    focus: "Rest — full recovery",
    exercises: [
      { name: "Light walk", sets: "20–30 min", notes: "Optional — keep it easy" },
      { name: "Mobility flow", sets: "10–15 min", notes: "Shoulders, spine, ankles" },
    ],
  },
];
