"use client";

import { cn } from "@/lib/utils";

interface BackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function Background({
  children,
  className,
}: BackgroundProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden bg-background",
        className
      )}
    >
      <div className="absolute inset-0 -z-20 bg-background" />

      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:40px_40px] opacity-40"
      />

      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,hsl(var(--muted))_0%,transparent_70%)] opacity-60"
      />

      {children}
    </div>
  );
}