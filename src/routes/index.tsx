import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, CalendarClock, Search, MessagesSquare, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const features = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft polished emails in Formal, Friendly, or Persuasive tones.",
  },
  {
    to: "/meetings",
    icon: FileText,
    title: "Meeting Summarizer",
    desc: "Turn long notes into decisions, action items, and deadlines.",
  },
  {
    to: "/tasks",
    icon: CalendarClock,
    title: "AI Task Planner",
    desc: "Prioritize tasks and build a realistic daily or weekly schedule.",
  },
  {
    to: "/research",
    icon: Search,
    title: "Research Assistant",
    desc: "Summarize topics with insights, key points, and recommendations.",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Chat",
    desc: "Ask anything — an interactive workplace assistant at your side.",
  },
] as const;

function Dashboard() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-hero text-primary-foreground p-8 md:p-12 shadow-elegant">
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary-glow/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered Productivity
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            One dashboard to automate your busywork.
          </h1>
          <p className="mt-3 text-primary-foreground/80 md:text-lg">
            Write emails, summarize meetings, plan your week, research topics, and chat with AI — all in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-lg bg-white text-foreground px-4 py-2.5 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Try the AI Chat <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 backdrop-blur border border-white/20 px-4 py-2.5 text-sm font-medium hover:bg-white/20 transition-colors"
            >
              Draft an Email
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold">Features</h2>
          <span className="text-xs text-muted-foreground">Powered by Lovable AI</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.to}
                to={f.to}
                className="group rounded-xl border border-border bg-card p-5 shadow-soft hover:shadow-elegant hover:border-primary/40 transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-base">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-accent/40 p-5 text-sm text-accent-foreground">
        <strong className="font-semibold">Responsible AI:</strong> Workly AI uses large language models. Outputs may be inaccurate, biased, or outdated. Always review AI-generated content before sending, sharing, or acting on it. Do not paste confidential information you're not authorized to share with third-party AI services.
      </section>
    </div>
  );
}
