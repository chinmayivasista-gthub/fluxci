"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Bot,
  Terminal,
  Wrench,
  FileSearch,
  Copy,
  Check,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

interface Props {
  analysis: any;
  status: string;
}

export default function AnalysisCard({ analysis, status }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    if (!analysis?.fix_command) return;

    try {
      await navigator.clipboard.writeText(analysis.fix_command);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  }

  /*
  ==================================================
  LOADING STATE
  ==================================================
  */

  if (!analysis) {
    return (
      <div className="surface relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-zinc-900/80 p-6 sm:p-8 md:p-10 lg:p-12 shadow-[0_0_0_1px_rgba(255,255,255,0.01),0_10px_40px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:gap-7 md:flex-row md:items-start md:gap-8">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center sm:h-20 sm:w-20">
            <div className="absolute inset-0 rounded-2xl border border-blue-400/20 bg-blue-500/10 blur-[0.5px]" />
            <div className="absolute inset-1 rounded-[14px] border border-blue-400/20 animate-pulse" />
            <div className="absolute -inset-1 rounded-2xl border border-blue-500/15 animate-ping [animation-duration:3s]" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-blue-400/20 bg-zinc-950/90 shadow-[0_0_20px_rgba(59,130,246,0.25)] sm:h-16 sm:w-16">
              <Bot size={28} className="text-blue-400 animate-pulse" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300/90">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Investigation Status
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-[2.6rem]">
              {status}
            </h2>

            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-zinc-400 sm:text-base md:text-[1.05rem]">
              FluxCI is currently processing your build logs. Every stage of the
              investigation is executed in sequence while the live pipeline
              updates in real time.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live analysis in progress
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
  ==================================================
  REPORT
  ==================================================
  */

  return (
    <div className="w-full space-y-5 sm:space-y-6 md:space-y-7">
      {/* ================================================= */}
      {/* HEADER CARD                                       */}
      {/* ================================================= */}

      <div className="surface relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-950 via-zinc-950/95 to-zinc-900/80 p-6 sm:p-8 md:p-10 lg:p-12 shadow-[0_0_0_1px_rgba(255,255,255,0.01),0_12px_50px_rgba(0,0,0,0.5)]">
        <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-7 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-300/90">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
              Investigation Report
            </p>

            <div className="mt-5 flex items-start gap-4">
              <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10 shadow-[0_0_24px_rgba(239,68,68,0.2)] sm:h-14 sm:w-14">
                <AlertTriangle size={24} className="text-red-400" />
              </div>

              <div className="min-w-0">
                <h1 className="break-words text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl lg:text-[2rem]">
                  {analysis.error_type}
                </h1>
                <p className="mt-2 text-xs uppercase tracking-wider text-zinc-500">
                  Failure classification
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:text-base md:text-[1.02rem]">
              FluxCI successfully completed the investigation and identified the
              failing stage, probable root cause and recommended resolution.
            </p>
          </div>

          <div className="shrink-0 self-start rounded-xl border border-zinc-800/70 bg-zinc-900/60 p-1.5 backdrop-blur">
            <StatusBadge source={analysis.analysis_source} />
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* DETAILS GRID / STACK                              */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
        {/* ROOT CAUSE */}
        <section className="surface group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/45 p-5 sm:p-6 md:p-8 transition-all duration-300 hover:border-zinc-700/70 hover:bg-zinc-950/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-600/40 to-transparent opacity-70" />
          <div className="mb-5 flex items-start gap-4 border-b border-zinc-800/70 pb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-500/10 shadow-[0_0_18px_rgba(59,130,246,0.2)]">
              <FileSearch size={18} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                Root Cause
              </h2>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Identified trigger event
              </p>
            </div>
          </div>

          <p className="max-w-4xl text-sm leading-relaxed text-zinc-300 sm:text-[15px] md:text-base">
            {analysis.root_cause ?? "Not available."}
          </p>
        </section>

        {/* EXPLANATION */}
        <section className="surface group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/45 p-5 sm:p-6 md:p-8 transition-all duration-300 hover:border-zinc-700/70 hover:bg-zinc-950/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-600/40 to-transparent opacity-70" />
          <div className="mb-5 flex items-start gap-4 border-b border-zinc-800/70 pb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-500/10 shadow-[0_0_18px_rgba(139,92,246,0.2)]">
              <Bot size={18} className="text-violet-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                Explanation
              </h2>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                AI analysis & system reasoning
              </p>
            </div>
          </div>

          <p className="max-w-4xl text-sm leading-relaxed text-zinc-300 sm:text-[15px] md:text-base">
            {analysis.explanation ?? "Not available."}
          </p>
        </section>

        {/* SUGGESTED FIX */}
        <section className="surface group relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/45 p-5 sm:p-6 md:p-8 transition-all duration-300 hover:border-zinc-700/70 hover:bg-zinc-950/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-600/40 to-transparent opacity-70" />
          <div className="mb-5 flex items-start gap-4 border-b border-zinc-800/70 pb-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-500/10 shadow-[0_0_18px_rgba(16,185,129,0.2)]">
              <Wrench size={18} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                Suggested Fix
              </h2>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                Recommended resolution steps
              </p>
            </div>
          </div>

          <p className="max-w-4xl text-sm leading-relaxed text-zinc-300 sm:text-[15px] md:text-base">
            {analysis.fix_suggestion ?? "Not available."}
          </p>
        </section>

        {/* TERMINAL COMMAND */}
        <section className="surface relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/45 p-5 sm:p-6 md:p-8 transition-all duration-300 hover:border-zinc-700/70 hover:bg-zinc-950/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-600/40 to-transparent opacity-70" />

          <div className="mb-5 flex flex-col gap-4 border-b border-zinc-800/70 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-500/10 shadow-[0_0_18px_rgba(34,211,238,0.2)]">
                <Terminal size={18} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                  Terminal Command
                </h2>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
                  Execute to apply recommended fix
                </p>
              </div>
            </div>

            <button
              onClick={copyCommand}
              disabled={!analysis?.fix_command}
              className={`group/copy inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 ${
                copied
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] focus:ring-emerald-500/40"
                  : "border-zinc-700/80 bg-zinc-900/80 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800/90 active:scale-[0.98] focus:ring-zinc-500/40"
              }`}
            >
              {copied ? (
                <>
                  <Check size={15} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy
                    size={15}
                    className="transition-transform duration-200 group-hover/copy:scale-110"
                  />
                  <span>Copy Command</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-800/90 bg-[#050507] shadow-[inset_0_1px_0_rgba(255,255,255,0.02),inset_0_-1px_0_rgba(255,255,255,0.01),0_10px_30px_rgba(0,0,0,0.35)]">
            {/* Terminal Title Bar / Chrome */}
            <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-950/90 px-4 py-3 sm:px-5 select-none">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/50 transition-colors hover:bg-red-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/50 transition-colors hover:bg-yellow-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/50 transition-colors hover:bg-green-500" />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500">
                <span>sh</span>
                <span className="text-zinc-700">•</span>
                <span>fluxci-hotfix</span>
              </div>
              <div className="w-12 sm:w-14" />
            </div>

            {/* Terminal command container */}
            <div className="flex items-start gap-3 overflow-x-auto p-4 font-mono text-sm leading-relaxed text-zinc-100 sm:p-5 sm:text-[15px] md:p-6 md:text-base">
              <span className="mt-[2px] select-none font-bold text-blue-500">❯</span>
              <pre className="min-w-0 flex-1 whitespace-pre overflow-x-auto">
                <code className="font-semibold tracking-wide text-emerald-400 selection:bg-emerald-500/20">
                  {analysis.fix_command ?? "Not available."}
                </code>
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}