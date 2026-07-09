import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarClock,
  Search,
  MessagesSquare,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", icon: FileText },
  { to: "/tasks", label: "Task Planner", icon: CalendarClock },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/chat", label: "AI Chat", icon: MessagesSquare },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="px-5 py-6 flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-semibold text-base leading-tight">SmartDesk AI</div>
            <div className="text-xs text-sidebar-foreground/60">Productivity Assistant</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-1">
          {nav.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors " +
                  (active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground")
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 m-3 rounded-lg bg-sidebar-accent/50 text-xs text-sidebar-foreground/80 border border-sidebar-border">
          <div className="flex items-center gap-1.5 font-medium text-sidebar-accent-foreground mb-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            Responsible AI
          </div>
          Outputs are AI-generated. Review for accuracy before sharing or acting on them.
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center gap-2 px-4 py-3 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
          <div className="h-8 w-8 rounded-md bg-gradient-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold">SmartDesk AI</span>
        </header>
        <nav className="md:hidden flex overflow-x-auto gap-1 px-2 py-2 bg-card border-b border-border">
          {nav.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={
                  "whitespace-nowrap rounded-md px-3 py-1.5 text-xs " +
                  (active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto">{children}</main>
        <footer className="px-6 md:px-10 py-4 text-xs text-muted-foreground border-t border-border">
          AI-generated content may be inaccurate. Always review before use. © SmartDesk AI
        </footer>
      </div>
    </div>
  );
}
