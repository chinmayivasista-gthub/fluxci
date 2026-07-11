"use client";

import {
  CheckCircle2,
  Circle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface InvestigationTimelineProps {
  currentStatus?: string;
  loading?: boolean;
  analysisSource?: string;
}

const stages = [
  {
    id: "received",
    label: "Log Received",
    status: "Receiving log...",
  },
  {
    id: "cleaned",
    label: "Log Cleaned",
    status: "Cleaning log...",
  },
  {
    id: "stack",
    label: "Stack Trace Extracted",
    status: "Extracting stack trace...",
  },
  {
    id: "failure",
    label: "Failure Section Located",
    status: "Locating failure section...",
  },
  {
    id: "rules",
    label: "Deterministic Rule Matched",
    status: "Running deterministic rules...",
  },
  {
    id: "ai",
    label: "Gemini Analysis",
    status: "Running Gemini...",
  },
  {
    id: "done",
    label: "Completed",
    status: "Generating report...",
  },
];

export default function InvestigationTimeline({
  currentStatus,
  loading = false,
  analysisSource,
}: InvestigationTimelineProps) {
  const activeIndex = stages.findIndex(
    (stage) => stage.status === currentStatus
  );

  return (
    <section className="surface overflow-hidden">
      <div className="workspace-header">
        <div>
          <p className="muted-label">
            Investigation Timeline
          </p>

          <h2 className="text-lg font-semibold">
            Backend Pipeline
          </h2>
        </div>
      </div>

      <div className="workspace-content">
        <div className="space-y-5">

          {stages.map((stage, index) => {
            const completed =
              loading && index < activeIndex;

            const active =
              loading && index === activeIndex;

            const aiSkipped =
              !loading &&
              analysisSource === "deterministic" &&
              stage.id === "ai";

            return (
              <div
                key={stage.id}
                className="flex items-start gap-4"
              >
                <div className="mt-0.5">

                  {completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : active ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  ) : aiSkipped ? (
                    <Sparkles className="h-5 w-5 text-zinc-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-zinc-700" />
                  )}

                </div>

                <div className="flex-1">
                  <p className="font-medium">
                    {stage.label}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {aiSkipped
                      ? "Skipped (deterministic engine succeeded)"
                      : completed
                      ? "Completed"
                      : active
                      ? "Running..."
                      : "Pending"}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}