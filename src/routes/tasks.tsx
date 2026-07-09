import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarClock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { planTasks } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner — SmartDesk AI" }] }),
  component: TasksPage,
});

function TasksPage() {
  const fn = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<"Day" | "Week">("Day");
  const [output, setOutput] = useState("");

  const mutation = useMutation({
    mutationFn: async () => fn({ data: { tasks, horizon } }),
    onSuccess: (r) => setOutput(r.text),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        icon={<CalendarClock className="h-5 w-5 text-primary-foreground" />}
        title="AI Task Planner"
        description="Turn a messy task list into a prioritized, time-blocked schedule."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft space-y-4">
          <div className="grid gap-2">
            <Label>Plan for</Label>
            <Select value={horizon} onValueChange={(v) => setHorizon(v as typeof horizon)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Day">Today</SelectItem>
                <SelectItem value="Week">This week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tasks">Tasks & context *</Label>
            <Textarea
              id="tasks"
              rows={12}
              placeholder={
                "One task per line. Include deadlines, effort, or importance where you can.\n\n" +
                "e.g.\n- Finish Q4 forecast (due Fri, ~3h)\n- Reply to client RFP (urgent)\n- Review PRs from Ana\n- Prep 1:1 with manager"
              }
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>
          <Button
            onClick={() => mutation.mutate()}
            disabled={!tasks.trim() || mutation.isPending}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            {mutation.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Planning…</>
            ) : (
              "Build my schedule"
            )}
          </Button>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Your Schedule</h2>
          {output ? (
            <AiOutput text={output} />
          ) : (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              A prioritized, time-blocked plan will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
