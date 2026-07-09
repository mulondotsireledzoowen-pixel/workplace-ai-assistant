import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { summarizeMeeting } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — SmartDesk AI" }] }),
  component: MeetingsPage,
});

const SAMPLE = `Team sync — Oct 4
Attendees: Priya, Marcus, Sam, Devon
- Priya walked through Q4 roadmap; agreed to move onboarding revamp ahead of billing.
- Marcus: infra migration blocked on vendor SOC2; will chase Wed.
- Sam to draft launch comms by next Fri (Oct 11).
- Decision: pause the referral experiment; revisit in Nov.
- Devon: hire freelance designer for landing page; budget approved up to $4k.`;

function MeetingsPage() {
  const fn = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");

  const mutation = useMutation({
    mutationFn: async () => fn({ data: { notes } }),
    onSuccess: (r) => setOutput(r.text),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        icon={<FileText className="h-5 w-5 text-primary-foreground" />}
        title="Meeting Notes Summarizer"
        description="Paste raw notes and get a summary, decisions, action items, and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notes">Meeting notes</Label>
            <button
              type="button"
              onClick={() => setNotes(SAMPLE)}
              className="text-xs text-primary hover:underline"
            >
              Load sample
            </button>
          </div>
          <Textarea
            id="notes"
            rows={16}
            placeholder="Paste transcript, bullets, or free-form notes…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button
            onClick={() => mutation.mutate()}
            disabled={!notes.trim() || mutation.isPending}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            {mutation.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Summarizing…</>
            ) : (
              "Summarize"
            )}
          </Button>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Summary</h2>
          {output ? (
            <AiOutput text={output} />
          ) : (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Your summary, decisions, and action items will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
