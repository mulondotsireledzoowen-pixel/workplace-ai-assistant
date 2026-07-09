import type { ReactNode } from "react";

export function PageHeader({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow shrink-0">
          {icon}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
