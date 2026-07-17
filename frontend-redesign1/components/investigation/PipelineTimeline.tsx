"use client";

import { Circle, CheckCircle2, Loader2, Sparkles, XCircle } from "lucide-react";

export type PipelineStepStatus = "pending" | "active" | "completed" | "failed";

export interface TimelineStep {
  id: number;
  key: string;
  title: string;
  description: string;
}

interface PipelineTimelineProps {
  status?: string;
  currentStep?: string;
}

const steps: TimelineStep[] = [
  {
    id: 1,
    key: "LOG_RECEIVED",
    title: "Log Received",
    description: "Waiting for CI/CD build logs.",
  },
  {
    id: 2,
    key: "LOG_CLEANING",
    title: "Log Cleaned",
    description: "Removing timestamps and noisy output.",
  },
  {
    id: 3,
    key: "STACK_TRACE_EXTRACTION",
    title: "Stack Trace Extraction",
    description: "Searching for useful stack traces.",
  },
  {
    id: 4,
    key: "FAILURE_DETECTION",
    title: "Failure Detection",
    description: "Locating the failing build section.",
  },
  {
    id: 5,
    key: "RULE_ENGINE",
    title: "Rule Engine",
    description: "Checking deterministic rules.",
  },
  {
    id: 6,
    key: "GEMINI_ANALYSIS",
    title: "Gemini Analysis",
    description: "Executed only when required.",
  },
  {
    id: 7,
    key: "ROOT_CAUSE",
    title: "Root Cause",
    description: "Preparing explanation.",
  },
  {
    id: 8,
    key: "FIX_GENERATION",
    title: "Fix Generation",
    description: "Generating solution.",
  },
  {
    id: 9,
    key: "COMMAND_GENERATION",
    title: "Command Generation",
    description: "Preparing terminal commands.",
  },
  {
    id: 10,
    key: "COMPLETED",
    title: "Investigation Complete",
    description: "Final report ready.",
  },
];

export const STEP_KEYS = steps.map((step) => step.key);

export default function PipelineTimeline({
  status = "PENDING",
  currentStep = "LOG_RECEIVED",
}: PipelineTimelineProps) {
  const normalizedStatus = status.toLowerCase();
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <aside className="sticky top-32 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_24px_70px_-24px_rgba(0,0,0,0.65)]">
      {/* Header */}
      <div className="border-b border-zinc-800 p-9 md:p-11">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
            <Sparkles size={15} className="text-blue-400" />
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Investigation Pipeline
          </p>
        </div>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-[1.7rem]">
          Live Progress
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          FluxCI updates every stage below while your build log is being
          processed.
        </p>
      </div>

      {/* Steps List */}
      <div className="p-4 md:p-6">
        {steps.map((step, index) => {
          let stepStatus: PipelineStepStatus = "pending";

          if (normalizedStatus === "completed") {
            stepStatus = "completed";
          } else if (normalizedStatus === "failed") {
            if (index < currentIndex) stepStatus = "completed";
            else if (index === currentIndex) stepStatus = "failed";
          } else {
            if (currentIndex === -1) {
              stepStatus = index === 0 ? "active" : "pending";
            } else if (index < currentIndex) {
              stepStatus = "completed";
            } else if (index === currentIndex) {
              stepStatus = "active";
            }
          }

          const isActive = stepStatus === "active";
          const isCompleted = stepStatus === "completed";
          const isFailed = stepStatus === "failed";

          return (
            <div
              key={step.id}
              className={`
                group
                relative
                flex
                min-h-[92px]
                gap-5
                rounded-xl
                px-4
                py-1
                transition-colors
                duration-200
                ${
                  isActive
                    ? "bg-zinc-900/50 ring-1 ring-inset ring-blue-500/15"
                    : isFailed
                    ? "bg-red-500/[0.05] ring-1 ring-inset ring-red-500/15"
                    : "hover:bg-zinc-900/30"
                }
              `}
            >
              {/* Active/failed-step left accent */}
              {(isActive || isFailed) && (
                <span
                  className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-full ${
                    isFailed ? "bg-red-500/60" : "bg-blue-500/60"
                  }`}
                />
              )}

              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div
                  className={`
                    absolute
                    left-[35px]
                    top-[52px]
                    bottom-[-4px]
                    w-px
                    ${isCompleted ? "bg-emerald-500/25" : "bg-zinc-800"}
                  `}
                />
              )}

              {/* Status Circle Badge */}
              <div
                className={`
                  relative
                  z-10
                  mt-2
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  transition-all
                  duration-300
                  ${
                    isCompleted
                      ? "border-emerald-500/30 bg-emerald-500 text-zinc-950 shadow-[0_0_0_3px_rgba(16,185,129,0.12)]"
                      : isActive
                      ? "border-blue-500/40 bg-blue-500/15 text-blue-400 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
                      : isFailed
                      ? "border-red-500/40 bg-red-500/15 text-red-400 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
                      : "border-zinc-800 bg-zinc-950 text-zinc-600 group-hover:border-zinc-700"
                  }
                `}
              >
                {stepStatus === "pending" && (
                  <Circle size={13} className="stroke-[2.5px]" />
                )}

                {stepStatus === "active" && (
                  <Loader2 size={16} className="animate-spin stroke-[2.5px]" />
                )}

                {stepStatus === "completed" && (
                  <CheckCircle2 size={17} className="stroke-[2.5px]" />
                )}

                {stepStatus === "failed" && (
                  <XCircle size={17} className="stroke-[2.5px]" />
                )}
              </div>

              {/* Details Column */}
              <div className="min-w-0 flex-1 border-b border-zinc-900/80 pb-6 pt-2 group-last:border-transparent">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3
                    className={`text-[14.5px] font-medium tracking-tight transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : isFailed
                        ? "text-red-200"
                        : isCompleted
                        ? "text-zinc-300"
                        : "text-zinc-500"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <span
                    className={`
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-md
                      px-2
                      py-0.5
                      text-[9.5px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      transition-colors
                      duration-200
                      ${
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-400"
                          : isActive
                          ? "bg-blue-500/10 text-blue-400"
                          : isFailed
                          ? "bg-red-500/10 text-red-400"
                          : "bg-zinc-900 text-zinc-600"
                      }
                    `}
                  >
                    {isActive && (
                      <span className="h-1 w-1 rounded-full bg-blue-400 animate-pulse" />
                    )}
                    {stepStatus}
                  </span>
                </div>

                <p
                  className={`mt-1.5 text-[13px] leading-relaxed transition-colors duration-200 ${
                    isActive
                      ? "text-zinc-300"
                      : isFailed
                      ? "text-red-300/80"
                      : "text-zinc-500"
                  }`}
                >
                  {stepStatus === "pending" && step.description}
                  {stepStatus === "active" && "Processing this stage…"}
                  {stepStatus === "completed" && "Completed successfully."}
                  {stepStatus === "failed" && "This stage did not complete."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}