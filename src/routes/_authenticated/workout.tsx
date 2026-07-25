import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppNav } from "@/components/AppNav";
import { getSchedule } from "@/lib/schedule.functions";
import { getProgress, logSet } from "@/lib/logs.functions";
import { DAY_NAMES, dayIndexOf, todayLocal } from "@/lib/plan-data";
import { CheckCircle2, Dumbbell, Loader2, TrendingUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/workout")({
  head: () => ({
    meta: [
      { title: "Workout — Daily Plan" },
      { name: "description", content: "Weekly training split with set-by-set logging and progress history." },
    ],
  }),
  component: WorkoutPage,
});

function WorkoutPage() {
  const [selected, setSelected] = useState<number>(dayIndexOf(todayLocal()));
  const scheduleQ = useQuery({ queryKey: ["schedule"], queryFn: () => getSchedule() });
  const day = scheduleQ.data?.find((d) => d.day_index === selected);

  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <section>
          <div className="text-xs uppercase tracking-[0.2em] text-ember mb-1">Weekly split</div>
          <h1 className="text-5xl md:text-6xl font-display">Workout</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Ask the chat assistant to swap, add, or remove exercises. Log sets below.
          </p>
        </section>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {DAY_NAMES.map((name, i) => {
            const d = scheduleQ.data?.find((x) => x.day_index === i);
            const active = i === selected;
            return (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`rounded-lg border p-3 text-left transition ${
                  active
                    ? "border-ember bg-accent shadow-sm"
                    : "border-border bg-card hover:border-ember/50"
                }`}
              >
                <div className={`text-xs font-medium ${active ? "text-ember" : "text-muted-foreground"}`}>
                  {name.slice(0, 3).toUpperCase()}
                </div>
                <div className="text-xs mt-1 line-clamp-2">{d?.focus ?? "—"}</div>
              </button>
            );
          })}
        </div>

        {scheduleQ.isLoading ? (
          <Skeleton />
        ) : day ? (
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="h-5 w-5 text-ember" />
              <h2 className="font-display text-2xl">{day.focus}</h2>
            </div>
            {day.exercises.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No exercises yet. Ask the assistant to add some.
              </div>
            ) : (
              <ul className="space-y-4">
                {day.exercises.map((ex) => (
                  <ExerciseRow key={ex.id} name={ex.name} prescription={ex.sets} notes={ex.notes} />
                ))}
              </ul>
            )}
          </section>
        ) : null}
      </main>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="text-sm text-muted-foreground flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" /> Loading schedule…
    </div>
  );
}

function ExerciseRow({ name, prescription, notes }: { name: string; prescription: string; notes: string | null }) {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [rpe, setRpe] = useState("");
  const progressQ = useQuery({
    queryKey: ["progress", name],
    queryFn: () => getProgress({ data: { exercise_name: name, limit: 10 } }),
    enabled: expanded,
  });

  const logM = useMutation({
    mutationFn: () =>
      logSet({
        data: {
          exercise_name: name,
          reps: reps ? Number(reps) : undefined,
          weight: weight ? Number(weight) : undefined,
          rpe: rpe ? Number(rpe) : undefined,
        },
      }),
    onSuccess: () => {
      setReps("");
      setWeight("");
      setRpe("");
      qc.invalidateQueries({ queryKey: ["progress", name] });
    },
  });

  return (
    <li className="border border-border rounded-lg p-4 bg-background">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="font-medium">{name}</div>
          {notes && <div className="text-xs text-muted-foreground">{notes}</div>}
        </div>
        <div className="font-display text-lg text-ember whitespace-nowrap">{prescription}</div>
      </div>

      <button
        onClick={() => setExpanded((s) => !s)}
        className="mt-3 text-xs text-ember hover:underline flex items-center gap-1"
      >
        <TrendingUp className="h-3.5 w-3.5" />
        {expanded ? "Hide log" : "Log a set"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <NumInput label="Reps" value={reps} onChange={setReps} />
            <NumInput label="Weight" value={weight} onChange={setWeight} placeholder="kg" />
            <NumInput label="RPE" value={rpe} onChange={setRpe} placeholder="1–10" />
          </div>
          <button
            onClick={() => logM.mutate()}
            disabled={logM.isPending || !reps}
            className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {logM.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Log set
          </button>

          {progressQ.data && progressQ.data.length > 0 && (
            <div className="pt-3 border-t border-border">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Recent sets</div>
              <ul className="text-xs space-y-1">
                {progressQ.data.map((row) => (
                  <li key={row.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {new Date(row.logged_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                      {" · set "}{row.set_number}
                    </span>
                    <span>
                      {row.reps ?? "—"} reps
                      {row.weight ? ` @ ${row.weight}kg` : ""}
                      {row.rpe ? ` · RPE ${row.rpe}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function NumInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-ember"
      />
    </label>
  );
}
