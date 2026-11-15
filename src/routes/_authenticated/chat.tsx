import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppNav } from "@/components/AppNav";
import { createThread, deleteThread, listThreads } from "@/lib/threads.functions";
import { Loader2, MessageSquare, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [
      { title: "Assistant — Daily Plan" },
      { name: "description", content: "Chat with your training assistant. Update your schedule and log progress in plain English." },
      { property: "og:title", content: "Workout Assistant — The Workout Zone" },
      { property: "og:description", content: "Chat with your training assistant to update your schedule and track progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatLayout,
});

function ChatLayout() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const threadsQ = useQuery({ queryKey: ["threads"], queryFn: () => listThreads() });

  const createM = useMutation({
    mutationFn: () => createThread(),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ["threads"] });
      navigate({ to: "/chat/$threadId", params: { threadId: r.id } });
    },
  });

  const deleteM = useMutation({
    mutationFn: (id: string) => deleteThread({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["threads"] }),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <AppNav />
      <div className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 grid md:grid-cols-[260px_1fr] gap-6">
        <aside className="rounded-xl border border-border bg-card p-3 h-fit md:sticky md:top-6">
          <button
            onClick={() => createM.mutate()}
            disabled={createM.isPending}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {createM.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            New chat
          </button>
          <div className="mt-3 space-y-1">
            {threadsQ.isLoading && (
              <div className="text-xs text-muted-foreground p-2 flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Loading…
              </div>
            )}
            {threadsQ.data?.length === 0 && (
              <div className="text-xs text-muted-foreground p-2">
                No chats yet. Click "New chat".
              </div>
            )}
            {threadsQ.data?.map((t) => (
              <div key={t.id} className="group relative">
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  className="block rounded-md px-3 py-2 text-sm hover:bg-secondary text-foreground/80"
                  activeProps={{ className: "block rounded-md px-3 py-2 text-sm bg-accent text-ember font-medium" }}
                >
                  <div className="flex items-center gap-2 pr-6">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{t.title}</span>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (confirm("Delete this chat?")) deleteM.mutate(t.id);
                  }}
                  className="absolute right-1 top-1.5 opacity-0 group-hover:opacity-100 rounded p-1 hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
