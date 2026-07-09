import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Mail, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { generateEmail } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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


export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — Workly AI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState<"Formal" | "Friendly" | "Persuasive">("Formal");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => fn({ data: { recipient, subject, tone, context } }),
    onSuccess: (r) => setOutput(r.text),
    onError: (e: Error) => toast.error(e.message),
  });

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <PageHeader
        icon={<Mail className="h-5 w-5 text-primary-foreground" />}
        title="Smart Email Generator"
        description="Generate professional emails in the tone that fits."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient (optional)</Label>
            <Input
              id="recipient"
              placeholder="e.g. Jane Smith, Marketing Lead"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject hint (optional)</Label>
            <Input
              id="subject"
              placeholder="e.g. Follow-up on Q3 proposal"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="context">What should the email say? *</Label>
            <Textarea
              id="context"
              rows={8}
              placeholder="Describe the purpose, key points, and any specifics to include..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          <Button
            onClick={() => mutation.mutate()}
            disabled={!context.trim() || mutation.isPending}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            {mutation.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating…</>
            ) : (
              "Generate Email"
            )}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Generated Email</h2>
            {output && (
              <Button size="sm" variant="outline" onClick={copy}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </div>
          {output ? (
            <>
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                rows={16}
                className="font-mono text-sm bg-card"
              />
              <p className="text-xs text-muted-foreground">Edit the draft above before sending.</p>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Your generated email will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
