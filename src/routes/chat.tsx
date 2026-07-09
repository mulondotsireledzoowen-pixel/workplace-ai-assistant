import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { MessagesSquare, Loader2, Send, Sparkles, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { chat } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat — Workly AI" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Draft a polite follow-up to a client who hasn't replied in 2 weeks.",
  "Give me 5 icebreaker questions for a new team offsite.",
  "How do I prioritize when everything feels urgent?",
  "Summarize the pros and cons of async standups.",
];

function ChatPage() {
  const fn = useServerFn(chat);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: async (msgs: Msg[]) => fn({ data: { messages: msgs } }),
    onSuccess: (r) =>
      setMessages((m) => [...m, { role: "assistant", content: r.text }]),
    onError: (e: Error) => {
      toast.error(e.message);
      setMessages((m) => m.slice(0, -1));
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const send = () => {
    const text = input.trim();
    if (!text || mutation.isPending) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  };

  const useSuggestion = (s: string) => {
    const next: Msg[] = [...messages, { role: "user", content: s }];
    setMessages(next);
    mutation.mutate(next);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader
        icon={<MessagesSquare className="h-5 w-5 text-primary-foreground" />}
        title="AI Chat"
        description="Ask anything — your workplace assistant is one message away."
      >
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setMessages([])}>
            <RotateCcw className="h-4 w-4 mr-1" /> New chat
          </Button>
        )}
      </PageHeader>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-xl border border-border bg-card shadow-soft p-4 md:p-6 space-y-4"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-10">
            <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">How can I help today?</h3>
              <p className="text-sm text-muted-foreground">Try a suggestion or type your own question.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 max-w-xl w-full">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => useSuggestion(s)}
                  className="text-left rounded-lg border border-border bg-background px-3 py-2 text-sm hover:border-primary/40 hover:bg-accent/30 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm"
                  : "max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm"
              }
            >
              {m.role === "assistant" ? (
                <div className="prose-ai text-sm"><ReactMarkdown>{m.content}</ReactMarkdown></div>
              ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          </div>
        ))}

        {mutation.isPending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-end gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={2}
          placeholder="Ask anything… (Shift+Enter for newline)"
          className="resize-none bg-card"
        />
        <Button
          onClick={send}
          disabled={!input.trim() || mutation.isPending}
          className="bg-gradient-primary hover:opacity-90 h-auto py-3"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
