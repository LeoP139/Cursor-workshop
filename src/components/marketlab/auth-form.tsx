import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const fieldClassName =
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30";

export function AuthField({
  id,
  label,
  type = "text",
  name,
  autoComplete,
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
  name: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className={fieldClassName}
      />
    </div>
  );
}

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-6">{children}</div>
      {footer ? (
        <div className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export function AuthMessage({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        tone === "error"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
      )}
    >
      {children}
    </p>
  );
}
