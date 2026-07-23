"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Bot,
  Check,
  Copy,
  Download,
  FileSearch,
  ShieldAlert,
  Terminal,
  Wrench,
} from "lucide-react";

import StatusBadge from "./StatusBadge";
import type { Analysis } from "@/types/analysis";

interface Props {
  analysis: Analysis | null;
  status: string;
  failed?: boolean;
}

export default function AnalysisCard({ analysis, status, failed }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    if (!analysis?.fix_command) return;

    try {
      await navigator.clipboard.writeText(analysis.fix_command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  function downloadAnalysis() {
    if (!analysis) return;

    const timestamp = new Date(analysis.created_at || Date.now());

    const lines = [
      "FluxCI Diagnostic Report",
      "========================",
      "",
      `Error Type:        ${analysis.error_type ?? "Not available."}`,
      `Analysis Source:   ${
        analysis.analysis_source?.toLowerCase() === "gemini"
          ? "Gemini AI"
          : "Deterministic Rule"
      }`,
      `Exit Code:         ${
        analysis.exit_code ?? "Not available."
      }`,
      `Generated:         ${timestamp.toLocaleString()}`,
      "",
      "Root Cause",
      "----------",
      analysis.root_cause ?? "Not available.",
      "",
      "Explanation",
      "-----------",
      analysis.explanation ?? "Not available.",
      "",
      "Suggested Fix",
      "-------------",
      analysis.fix_suggestion ?? "Not available.",
      "",
      "Resolution Command",
      "-------------------",
      analysis.fix_command ?? "Not available.",
      "",
    ].join("\n");

    const blob = new Blob([lines], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `fluxci-analysis-${analysis.job_id || analysis.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  /*
  ==================================================
  FAILED STATE
  ==================================================
  */
  if (failed && !analysis) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-red-500/10 bg-[#000000] px-6 py-28 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-500/[0.04] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/[0.06] border border-red-500/20 mb-8">
            <ShieldAlert size={22} className="text-red-400" />
          </div>

          <h2 className="text-xl md:text-2xl font-medium tracking-tight text-zinc-100 mb-3">
            Investigation failed
          </h2>

          <p className="max-w-[420px] text-sm text-zinc-500 leading-relaxed">
            FluxCI could not complete this investigation. Confirm the log was
            complete and start a new investigation from the workspace.
          </p>
        </div>
      </div>
    );
  }

  /*
  ==================================================
  LOADING STATE
  ==================================================
  */

  if (!analysis) {
    return (
      <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-white/[0.04] bg-[#000000] px-6 py-32 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] relative overflow-hidden">
        {/* Subtle ambient light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/[0.03] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-white/[0.02] border border-white/[0.05] shadow-inner mb-8">
            <div className="absolute inset-0 rounded-xl border border-blue-500/20 animate-[spin_4s_linear_infinite] [mask-image:linear-gradient(transparent,black)]" />
            <Bot size={22} className="text-zinc-400" />
          </div>

          <div className="flex items-center gap-2.5 mb-4">
            <div className="relative flex h-2 w-2 items-center justify-center">
              <div className="absolute h-full w-full rounded-full bg-blue-500 animate-ping opacity-60" />
              <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            </div>
            <span className="text-[11px] font-medium tracking-[0.2em] text-zinc-500 uppercase">
              Pipeline Active
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-medium tracking-tight text-zinc-100 mb-3">
            {status}
          </h2>

          <p className="max-w-[420px] text-center text-sm text-zinc-500 leading-relaxed">
            FluxCI is investigating the build logs. Execution stages run
            sequentially while the pipeline updates.
          </p>
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
    <div className="w-full bg-[#000000] border border-white/[0.04] rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.02)] overflow-hidden animate-fade-in-up">
      {/* ================================================= */}
      {/* HEADER                                            */}
      {/* ================================================= */}
      <header className="relative flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/[0.04] p-8 md:p-10 bg-white/[0.01]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

        <div className="flex items-start gap-5">
          <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.03]">
            <AlertTriangle size={20} className="text-red-400" strokeWidth={1.5} />
          </div>

          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[10px] font-medium tracking-[0.2em] text-red-400/80 uppercase">
                Diagnostic Report
              </span>
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-zinc-50 mb-2">
              {analysis.error_type}
            </h1>
            <p className="max-w-2xl text-[15px] leading-relaxed text-zinc-400">
              Investigation complete. The failing stage, root cause, and
              recommended resolution are detailed below.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <StatusBadge source={analysis.analysis_source} />
            <button
              onClick={downloadAnalysis}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[13px] font-medium text-zinc-400 transition-all duration-200 hover:bg-white/[0.06] hover:text-zinc-200"
            >
              <Download size={14} strokeWidth={1.5} />
              <span>Download</span>
            </button>
          </div>
          {analysis.exit_code !== null && analysis.exit_code !== undefined && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-zinc-500">
              Exit code: {analysis.exit_code}
            </span>
          )}
        </div>
      </header>

      {/* ================================================= */}
      {/* DETAILS                                           */}
      {/* ================================================= */}
      <div className="flex flex-col divide-y divide-white/[0.04]">
        {/* ROOT CAUSE */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12 p-8 md:p-10 bg-transparent transition-colors hover:bg-white/[0.01]">
          <div className="flex w-full md:w-[200px] shrink-0 items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02]">
              <FileSearch size={14} className="text-zinc-400" />
            </div>
            <h2 className="text-sm font-medium text-zinc-300">Root Cause</h2>
          </div>
          <div className="flex-1 mt-1 md:mt-0">
            <p className="text-[15px] leading-relaxed text-zinc-400 whitespace-pre-line">
              {analysis.root_cause ?? "Not available."}
            </p>
          </div>
        </div>

        {/* EXPLANATION */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12 p-8 md:p-10 bg-transparent transition-colors hover:bg-white/[0.01]">
          <div className="flex w-full md:w-[200px] shrink-0 items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02]">
              <Bot size={14} className="text-zinc-400" />
            </div>
            <h2 className="text-sm font-medium text-zinc-300">Explanation</h2>
          </div>
          <div className="flex-1 mt-1 md:mt-0">
            <p className="text-[15px] leading-relaxed text-zinc-400 whitespace-pre-line">
              {analysis.explanation ?? "Not available."}
            </p>
          </div>
        </div>

        {/* SUGGESTED FIX */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12 p-8 md:p-10 bg-transparent transition-colors hover:bg-white/[0.01]">
          <div className="flex w-full md:w-[200px] shrink-0 items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02]">
              <Wrench size={14} className="text-zinc-400" />
            </div>
            <h2 className="text-sm font-medium text-zinc-300">Suggested Fix</h2>
          </div>
          <div className="flex-1 mt-1 md:mt-0">
            <p className="text-[15px] leading-relaxed text-zinc-400 whitespace-pre-line">
              {analysis.fix_suggestion ?? "Not available."}
            </p>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* TERMINAL SECTION                                  */}
      {/* ================================================= */}
      <div className="p-8 md:p-10 pt-4 md:pt-6 bg-[#000000]">
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0A0A0A] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
          <div className="flex items-center justify-between border-b border-white/[0.04] bg-white/[0.01] px-5 py-3">
            <div className="flex items-center gap-2.5">
              <Terminal size={14} className="text-zinc-500" />
              <span className="text-[12px] font-medium text-zinc-400">
                Resolution Command
              </span>
            </div>

            <button
              onClick={copyCommand}
              disabled={!analysis?.fix_command}
              className={`
                flex items-center gap-2 rounded-md border px-3 py-1.5 text-[12px] font-medium transition-all duration-200 outline-none
                ${
                  copied
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-transparent bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                }
              `}
            >
              {copied ? (
                <>
                  <Check size={13} strokeWidth={2} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} strokeWidth={1.5} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-start gap-4 overflow-x-auto p-6 font-mono text-[13px] leading-relaxed text-zinc-300 md:text-[14px]">
            <span className="select-none text-zinc-600 mt-0.5">$</span>
            <pre className="flex-1 whitespace-pre">
              <code className="text-zinc-100 selection:bg-white/[0.15]">
                {analysis.fix_command ?? "Not available."}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}