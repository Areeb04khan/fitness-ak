import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ChefHat, Dumbbell, Lock, MessageSquare, Pill, Sparkles, Droplets } from "lucide-react";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo — Daily Plan" },
      { name: "description", content: "Preview of the Daily Plan app — training, meals, hydration, and AI assistant." },
    ],
  }),
  component: DemoPage,
});

// ── Dummy data ────────────────────────────────────────────────────────────────

const DEMO_DAY = {
  focus: "Pull — Hypertrophy",
  day: "Friday",
  exercises: [
    { name: "Pull-up / Lat Pulldown", sets: "4×8–10" },
    { name: "Seated Cable Row", sets: "3×10" },
    { name: "Face Pull", sets: "3×15" },
    { name: "Barbell / DB Curl", sets: "3×10" },
    { name: "Hammer Curl", sets: "3×12" },
  ],
};

const DEMO_SPLIT = [
  { label: "MON", focus: "Upper — Strength" },
  { label: "TUE", focus: "Lower — Strength" },
  { label: "WED", focus: "Push — Hypertrophy" },
  { label: "THU", focus: "Boxing" },
  { label: "FRI", focus: "Pull — Hypertrophy", active: true },
  { label: "SAT", focus: "Legs — Pump" },
  { label: "SUN", focus: "Rest" },
];

const DEMO_MEALS = {
  breakfast: "Egg white omelette with vegetables + multigrain toast",
  lunch: "Grilled chicken breast + brown rice + salad + yogurt",
  dinner: "Chicken stir-fry with vegetables",
};

const DEMO_MEDS = [
  { name: "Creatine", dose: "5g", time: "Morning" },
  { name: "Whey Protein", dose: "30g", time: "Post-workout" },
  { name: "Omega-3 Fish Oil", dose: "1000mg", time: "With lunch" },
];

const DEMO_CHAT = [
  { role: "user", content: "Swap barbell rows for chest-supported rows on pull day" },
  {
    role: "assistant",
    content:
      "Done! I've replaced **Barbell Row** with **Chest-Supported Row** on your Pull — Hypertrophy day. The sets stay at 4×8–10. Better rear-delt isolation and takes stress off the lower back. 💪",
  },
  { role: "user", content: "Log 4 sets of bench: 8 reps at 80kg" },
  {
    role: "assistant",
    content:
      "Logged! 4 sets of **Barbell Bench Press** at 80 kg × 8 reps each. That's a solid push session — keep it consistent and progress when 8 reps feels comfortable.",
  },
];

// ── Components ────────────────────────────────────────────────────────────────

function DemoNav() {
  return (
    <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-10">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <span className="font-display text-xl tracking-wider">
          DAILY <span className="text-ember">·</span> PLAN
        </span>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-muted-foreground bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full font-medium">
            Sample preview — sign in for your personal data
          </span>
          <Link
            to="/auth"
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}

function DemoBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 py-2 px-4">
      <p className="text-center text-xs text-amber-800 max-w-3xl mx-auto">
        <Lock className="inline h-3 w-3 mr-1 mb-0.5" />
        <strong>Demo mode</strong> — all data below is fictional and for illustration only.{" "}
        <Link to="/auth" className="underline font-medium hover:text-amber-900">
          Sign in
        </Link>{" "}
        to see your real plan.
      </p>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <DemoNav />
      <DemoBanner />

      <main className="mx-auto max-w-5xl w-full px-4 py-8 space-y-6 flex-1">
        {/* Header */}
        <section>
          <div className="text-xs uppercase tracking-[0.2em] text-ember mb-1">
            Week 3 · Friday, 25 July 2025
          </div>
          <h1 className="text-5xl md:text-6xl font-display">My Day</h1>
        </section>

        {/* Weather placeholder */}
        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="text-4xl">🌤️</div>
          <div>
            <div className="font-medium">31°C · Partly cloudy</div>
            <div className="text-xs text-muted-foreground">New Delhi · Drink extra water on hot days</div>
          </div>
        </div>

        {/* Today's training */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-ember" />
              <h2 className="font-display text-2xl">Today's training</h2>
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1 bg-secondary px-2 py-1 rounded">
              <Lock className="h-3 w-3" /> Real data after sign in
            </span>
          </div>
          <div className="text-lg mb-1 font-medium">{DEMO_DAY.focus}</div>
          <div className="text-xs text-muted-foreground mb-4">{DEMO_DAY.day}</div>
          <ul className="divide-y divide-border">
            {DEMO_DAY.exercises.map((ex) => (
              <li key={ex.name} className="py-3 flex items-baseline justify-between gap-4">
                <div className="font-medium">{ex.name}</div>
                <div className="font-display text-lg text-ember whitespace-nowrap">{ex.sets}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* Full split link */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="h-5 w-5 text-ember" />
            <h2 className="font-display text-xl">Weekly split</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {DEMO_SPLIT.map((d) => (
              <div
                key={d.label}
                className={`rounded-lg border p-3 text-left ${
                  d.active ? "border-ember bg-accent shadow-sm" : "border-border bg-background"
                }`}
              >
                <div className={`text-xs font-medium ${d.active ? "text-ember" : "text-muted-foreground"}`}>
                  {d.label}
                </div>
                <div className="text-xs mt-1 line-clamp-2">{d.focus}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Water + Meds */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Water tracker */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="h-5 w-5 text-ember" />
              <h3 className="font-display text-xl">Hydration</h3>
            </div>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-display text-ember">2.5</span>
              <span className="text-sm text-muted-foreground mb-1">/ 4.0 L today</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5 mb-4">
              <div className="bg-ember h-2.5 rounded-full" style={{ width: "62.5%" }} />
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250, 250].map((_, i) => (
                <button
                  key={i}
                  disabled
                  className={`h-8 rounded text-xs font-medium transition-colors ${
                    i < 10 ? "bg-ember/80 text-white" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i < 10 ? "✓" : "+250ml"}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              1.5 L remaining — target 4 L (boxing day)
            </p>
          </div>

          {/* Meds checklist */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="h-5 w-5 text-ember" />
              <h3 className="font-display text-xl">Supplements</h3>
            </div>
            <ul className="space-y-3">
              {DEMO_MEDS.map((m, i) => (
                <li key={m.name}>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      defaultChecked={i < 2}
                      disabled
                      className="mt-1 h-4 w-4 accent-[var(--color-ember)]"
                    />
                    <div>
                      <div className={`text-sm ${i < 2 ? "line-through text-muted-foreground" : "font-medium"}`}>
                        {m.name} <span className="text-muted-foreground font-normal">{m.dose}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{m.time}</div>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-4 italic">
              Your private medications are never shown publicly.
            </p>
          </div>
        </div>

        {/* Meals */}
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="h-5 w-5 text-ember" />
            <h2 className="font-display text-2xl">Eating today</h2>
          </div>
          <ul className="text-sm space-y-2">
            <li><span className="text-muted-foreground">Breakfast:</span> {DEMO_MEALS.breakfast}</li>
            <li><span className="text-muted-foreground">Lunch:</span> {DEMO_MEALS.lunch}</li>
            <li><span className="text-muted-foreground">Dinner:</span> {DEMO_MEALS.dinner}</li>
          </ul>
          <div className="mt-4 text-xs text-muted-foreground">
            Targets: ~2,500 kcal · 170g protein · 250g carbs · 75g fat
          </div>
        </section>

        {/* Chat demo */}
        <section className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-ember" />
              <h2 className="font-display text-2xl">AI Assistant</h2>
            </div>
            <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Powered by Gemini
            </span>
          </div>
          <div className="p-6 space-y-3 bg-background/50">
            {DEMO_CHAT.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <span dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground text-center pt-2 italic">
              The assistant can update your workout plan, log sets, and manage supplements — all in plain English.
            </div>
          </div>
          <div className="border-t border-border p-4 bg-card">
            <div className="flex gap-2 items-center">
              <div className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground italic">
                Try: "Add 20 min of cardio to Sunday" …
              </div>
              <div className="rounded-md bg-secondary px-3 py-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                Sign in to chat
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl border-2 border-ember bg-accent/30 p-8 text-center">
          <Sparkles className="h-8 w-8 text-ember mx-auto mb-3" />
          <h2 className="font-display text-3xl mb-2">This is your plan.</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Sign in to see your real workout split, log your sets, track hydration, and chat with your personal AI assistant.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign in to your plan →
          </Link>
        </section>
      </main>

    </div>
  );
}
