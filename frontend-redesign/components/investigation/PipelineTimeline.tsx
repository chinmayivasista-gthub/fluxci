"use client";

import {
  Circle,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";

export type PipelineStatus =
  | "pending"
  | "active"
  | "completed";

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

export default function PipelineTimeline({
  status = "PENDING",
  currentStep = "Log Received",
}: PipelineTimelineProps) {
  return (
    <aside className="surface sticky top-32 overflow-hidden border border-zinc-800/80 bg-gradient-to-b from-zinc-950/50 to-zinc-900/30 shadow-2xl rounded-2xl">
      {/* Header */}
      <div className="border-b border-zinc-800/80 p-8 md:p-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-md shadow-blue-500/5">
            <Sparkles
              size={16}
              className="text-blue-400"
            />
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            Investigation Pipeline
          </p>
        </div>

        <h2 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Live Progress
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          FluxCI updates every stage below while your build log is being processed.
        </p>
      </div>

      {/* Steps List */}
      <div className="p-8 md:p-10 space-y-2">
        {steps.map((step, index) => {
          const currentIndex = steps.findIndex(
            (s) => s.key === currentStep
          );

          let stepStatus: PipelineStatus = "pending";

          if (status.toLowerCase() === "completed") {
            stepStatus = "completed";
          } else if (status.toLowerCase() === "failed") {
            if (step.key === currentStep) {
              stepStatus = "active";
            }
          } else {
            if (index < currentIndex) {
              stepStatus = "completed";
            } else if (index === currentIndex) {
              stepStatus = "active";
            }
          }

          return (
            <div
              key={step.id}
              className="relative flex min-h-[85px] gap-6"
            >
              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <div
                  className={`
                    absolute
                    left-[18px]
                    top-11
                    bottom-0
                    w-[2px]
                    ${
                      stepStatus === "completed"
                        ? "bg-green-500/30"
                        : "bg-zinc-800/60"
                    }
                  `}
                />
              )}

              {/* Status Circle Badge */}
              <div
                className={`
                  relative
                  z-10
                  mt-0.5
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
                    stepStatus === "completed"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-md shadow-emerald-500/5"
                      : stepStatus === "active"
                      ? "border-blue-500/40 bg-blue-500/15 text-blue-400 shadow-md shadow-blue-500/10 animate-pulse"
                      : "border-zinc-800 bg-[#020204] text-zinc-600"
                  }
                `}
              >
                {stepStatus === "pending" && (
                  <Circle
                    size={15}
                    className="stroke-[2.5px]"
                  />
                )}

                {stepStatus === "active" && (
                  <Loader2
                    size={16}
                    className="animate-spin stroke-[2.5px]"
                  />
                )}

                {stepStatus === "completed" && (
                  <CheckCircle2
                    size={16}
                    className="stroke-[2.5px]"
                  />
                )}
              </div>

              {/* Details Column */}
              <div className="flex-1 pb-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className={`text-[15px] font-bold tracking-tight transition-colors duration-200 ${stepStatus === "active" ? "text-blue-400" : stepStatus === "completed" ? "text-zinc-200" : "text-zinc-500"}`}>
                    {step.title}
                  </h3>

                  <span
                    className={`
                      rounded-full
                      px-2.5
                      py-0.5
                      text-[10px]
                      font-bold
                      tracking-wider
                      uppercase
                      transition-all
                      duration-200
                      ${
                        stepStatus === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                          : stepStatus === "active"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/15 animate-pulse"
                          : "bg-zinc-900/60 text-zinc-600 border border-zinc-800/40"
                      }
                    `}
                  >
                    {stepStatus}
                  </span>
                </div>

                <p className={`mt-2 text-xs leading-relaxed transition-colors duration-200 ${stepStatus === "active" ? "text-zinc-300" : "text-zinc-500"}`}>
                  {stepStatus === "pending" &&
                    step.description}

                  {stepStatus === "active" &&
                    "Processing this stage..."}

                  {stepStatus === "completed" &&
                    "Completed successfully."}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}