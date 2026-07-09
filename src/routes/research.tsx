import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { researchTopic } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — SmartDesk AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");

  const mutation = useMutation({
    mutationFn: async () => fn({ data: { topic } }),
    onSuccess: (r) => setOutput(r.text),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        icon={<Search className="h-5 w-5 text-primary-foreground" />}
        title="AI Research Assistant"
        description="Get a structured briefing with key points, insights, and recommendations."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="topic">Topic, question, or article to summarize *</Label>
            <Textarea
              id="topic"
              rows={12}
              placeholder={
                "e.g. 'Overview of retrieval-augmented generation for enterprise search'\n\nOr paste an article and ask for a summary + takeaways."
              }
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <Button
            onClick={() => mutation.mutate()}
            disabled={!topic.trim() || mutation.isPending}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            {mutation.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Researching…</>
            ) : (
              "Research"
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            AI research can be outdated or inaccurate. Verify important claims with primary sources.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Briefing</h2>
          {output ? (
            <AiOutput text={output} />
          ) : (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Your research briefing will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
