import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getThreadMessages, type StoredMessage } from "@/lib/threads.functions";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "Workout Assistant Conversation — The Workout Zone" },
      { name: "description", content: "Your personal workout assistant conversation and training progress." },
      { property: "og:title", content: "Workout Assistant Conversation — The Workout Zone" },
      { property: "og:description", content: "Your personal workout assistant conversation and training progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChatThread,
});

function ChatThread() {
  const { threadId } = Route.useParams();
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const [pending, setPending] = useState<StoredMessage | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const messagesQ = useQuery({
    queryKey: ["messages", threadId],
    queryFn: () => getThreadMessages({ data: { thread_id: threadId } }),
  });

  const sendM = useMutation({
    mutationFn: async (message: string) => {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error("Not signed in");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ thread_id: threadId, message }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `HTTP ${res.status}`);
      }
      return (await res.json()) as { reply: string };
    },
    onSuccess: () => {
      setPending(null);
      qc.invalidateQueries({ queryKey: ["messages", threadId] });
      qc.invalidateQueries({ queryKey: ["threads"] });
      qc.invalidateQueries({ queryKey: ["schedule"] });
      qc.invalidateQueries({ queryKey: ["meds"] });
      qc.invalidateQueries({ queryKey: ["progress"] });
    },
    onError: () => {
      setPending(null);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messagesQ.data, pending, sendM.isPending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId, sendM.isPending]);

  const submit = () => {
    const text = input.trim();
    if (!text || sendM.isPending) return;
    setInput("");
    setPending({
      id: "pending",
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    });
    sendM.mutate(text);
  };

  const displayed: StoredMessage[] = [...(messagesQ.data ?? []), ...(pending ? [pending] : [])];

  return (
    <div className="rounded-xl border border-border bg-card flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messagesQ.isLoading && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading messages…
          </div>
        )}
        {!messagesQ.isLoading && displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground">
            <Sparkles className="h-8 w-8 text-ember mb-2" />
            <div className="text-sm">
              Try: <em>"swap barbell rows for chest-supported rows on pull day"</em>
              <br /> or <em>"log today's bench: 4 sets of 8 at 80kg"</em>
            </div>
          </div>
        )}
        {displayed.map((m) => (
          <Bubble key={m.id} role={m.role} content={m.content} />
        ))}
        {sendM.isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
          </div>
        )}
        {sendM.isError && (
          <div className="text-sm text-destructive">
            {(sendM.error as Error).message}
          </div>
        )}
      </div>

      <div className="border-t border-border p-3">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Ask about your plan, or tell me to change it…"
            rows={2}
            className="flex-1 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-ember"
          />
          <button
            onClick={submit}
            disabled={!input.trim() || sendM.isPending}
            className="rounded-md bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 self-stretch"
          >
            {sendM.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ role, content }: { role: string; content: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-headings:my-1">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
