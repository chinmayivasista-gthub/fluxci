"use client";

import Link from "next/link";
import { Clock3, ArrowRight } from "lucide-react";

interface Investigation {
  id: string;
  error_type: string;
  analysis_source: string;
  created_at: string;
}

interface RecentInvestigationsProps {
  investigations?: Investigation[];
}

export default function RecentInvestigations({
  investigations = [],
}: RecentInvestigationsProps) {
  return (
    <section className="surface overflow-hidden">
      <div className="workspace-header">
        <div>
          <p className="muted-label">
            Recent Investigations
          </p>

          <h2 className="text-lg font-semibold">
            Latest 5 Analyses
          </h2>
        </div>

        <Link
          href="/history"
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition hover:bg-muted"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="workspace-content p-0">
        {investigations.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No investigations yet.
          </div>
        ) : (
          <div className="divide-y">
            {investigations.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/40"
              >
                <div>
                  <p className="font-medium">
                    {item.error_type}
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" />
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    item.analysis_source === "deterministic"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-blue-500/30 bg-blue-500/10 text-blue-400"
                  }`}
                >
                  {item.analysis_source}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}