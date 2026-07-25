import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  return (
    <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
      <Sparkles className="h-8 w-8 text-ember mb-3" />
      <h2 className="font-display text-3xl mb-2">Ask me anything</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Start a new chat to update your schedule, log a workout, or check your
        progress. Try: <em>"Swap barbell rows for chest-supported rows on pull day"</em>{" "}
        or <em>"Log 4 sets of bench: 8 reps @ 80kg"</em>.
      </p>
    </div>
  );
}
