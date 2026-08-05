import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppNav } from "@/components/AppNav";
import { Weather } from "@/components/Weather";
import { WaterTracker } from "@/components/WaterTracker";
import { getSchedule } from "@/lib/schedule.functions";
import { seedWorkoutPlan } from "@/lib/seed.functions";
import { listMeds } from "@/lib/meds.functions";
import {
  DAY_NAMES,
  NUTRITION_TARGETS,
  dayIndexOf,
  formatLongDate,
  getMealsForDate,
  getWeekNumber,
  todayLocal,
} from "@/lib/plan-data";
import { CalendarDays, ChefHat, Dumbbell, Loader2, Pill, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/today")({
  head: () => ({
    meta: [
      { title: "My Day — Daily Plan" },
      { name: "description", content: "Today's training focus, hydration target, meals, and medication checklist." },
      { property: "og:title", content: "My Day" },
      { property: "og:description", content: "Today's training focus and daily checklist." },
    ],
  }),
  component: MyDay,
});

function MyDay() {
  const today = todayLocal();
  const idx = dayIndexOf(today);
  const week = getWeekNumber(today);
  const meals = getMealsForDate(today);

  const scheduleQ = useQuery({ queryKey: ["schedule"], queryFn: () => getSchedule() });
  const medsQ = useQuery({ queryKey: ["meds"], queryFn: () => listMeds() });

  // Auto-seed Block A workout plan for new users
  const seedM = useMutation({ mutationFn: () => seedWorkoutPlan() });
  useEffect(() => {
    if (scheduleQ.data && scheduleQ.data.length === 0 && !seedM.isPending && !seedM.isSuccess && !seedM.isError) {
      seedM.mutate(undefined, {
        onSuccess: (result) => {
          if (result?.seeded) scheduleQ.refetch();
        },
      });
    }
  }, [scheduleQ.data]);

  const day = scheduleQ.data?.find((d) => d.day_index === idx);

  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <section>
          <div className="text-xs uppercase tracking-[0.2em] text-ember mb-1">
            Week {week} · {formatLongDate(today)}
          </div>
          <h1 className="text-5xl md:text-6xl font-display">My Day</h1>
        </section>

        <div className="rounded-xl border border-border bg-card p-5">
          <Weather />
        </div>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-ember" />
              <h2 className="font-display text-2xl">Today's training</h2>
            </div>
            <Link
              to="/chat"
              className="text-xs text-ember hover:underline flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Change via chat
            </Link>
          </div>
          {scheduleQ.isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading schedule…
            </div>
          ) : day ? (
            <>
              <div className="text-lg mb-3 font-medium">{day.focus}</div>
              <div className="text-xs text-muted-foreground mb-3">{DAY_NAMES[idx]}</div>
              <ul className="divide-y divide-border">
                {day.exercises.map((ex) => (
                  <li key={ex.id} className="py-3 flex items-baseline justify-between gap-4">
                    <div>
                      <div className="font-medium">{ex.name}</div>
                      {ex.notes && <div className="text-xs text-muted-foreground">{ex.notes}</div>}
                    </div>
                    <div className="font-display text-lg text-ember whitespace-nowrap">{ex.sets}</div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No schedule set up yet.</div>
          )}
        </section>

        <Link
          to="/workout"
          className="block rounded-xl border border-border bg-card p-5 hover:border-ember hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-ember" />
            <div className="flex-1">
              <div className="font-display text-xl">Full workout tracker</div>
              <div className="text-xs text-muted-foreground">Weekly split · log sets & watch progress</div>
            </div>
            <span className="text-ember">→</span>
          </div>
        </Link>

        <div className="grid gap-6 md:grid-cols-2">
          <WaterTracker />
          <MedChecklist items={medsQ.data ?? []} loading={medsQ.isLoading} date={today} />
        </div>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="h-5 w-5 text-ember" />
            <h2 className="font-display text-2xl">Eating today</h2>
          </div>
          <ul className="text-sm space-y-2">
            <li><span className="text-muted-foreground">Breakfast:</span> {meals.breakfast}</li>
            <li><span className="text-muted-foreground">Lunch:</span> {meals.lunch}</li>
            <li><span className="text-muted-foreground">Dinner:</span> {meals.dinner.name}</li>
          </ul>
          <div className="mt-4 text-xs text-muted-foreground">
            Targets: {NUTRITION_TARGETS.calories} kcal · {NUTRITION_TARGETS.protein_g}g P · {NUTRITION_TARGETS.carbs_g}g C · {NUTRITION_TARGETS.fat_g}g F
          </div>
        </section>
      </main>
    </div>
  );
}

function MedChecklist({
  items,
  loading,
  date,
}: {
  items: Array<{ id: string; name: string; dose: string; time_of_day: string; notes: string | null }>;
  loading: boolean;
  date: Date;
}) {
  const key = `meds-${date.toISOString().slice(0, 10)}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const stored = localStorage.getItem(key);
    setChecked(stored ? JSON.parse(stored) : {});
  }, [key]);

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Pill className="h-5 w-5 text-ember" />
        <h3 className="font-display text-xl">Meds & supplements</h3>
      </div>
      {loading ? (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : items.length === 0 ? (
        <div className="text-sm text-muted-foreground">Nothing yet — ask the assistant to add some.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.id}>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={!!checked[it.id]}
                  onChange={() => toggle(it.id)}
                  className="mt-1 h-4 w-4 accent-[var(--color-ember)]"
                />
                <div className="flex-1">
                  <div className={`text-sm ${checked[it.id] ? "line-through text-muted-foreground" : ""}`}>
                    <span className="font-medium">{it.name}</span>{" "}
                    <span className="text-muted-foreground">{it.dose}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {it.time_of_day}{it.notes ? ` · ${it.notes}` : ""}
                  </div>
                </div>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
