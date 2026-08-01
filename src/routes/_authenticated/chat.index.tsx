import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createThread, listThreads } from "@/lib/threads.functions";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/_authenticated/chat/")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const started = useRef(false);

  const threadsQ = useQuery({ queryKey: ["threads"], queryFn: () => listThreads() });

  const createM = useMutation({
    mutationFn: () => createThread(),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ["threads"] });
      navigate({ to: "/chat/$threadId", params: { threadId: r.id }, replace: true });
    },
  });

  useEffect(() => {
    if (!threadsQ.data || started.current) return;
    started.current = true;
    const newest = threadsQ.data[0];
    if (newest) {
      navigate({ to: "/chat/$threadId", params: { threadId: newest.id }, replace: true });
    } else {
      createM.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadsQ.data]);

  return (
    <div className="rounded-xl border border-border bg-card p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
      {createM.isError ? (
        <div className="text-sm text-destructive">{(createM.error as Error).message}</div>
      ) : (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Opening your assistant…
        </div>
      )}
    </div>
  );
}
