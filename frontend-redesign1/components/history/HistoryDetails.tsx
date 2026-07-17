"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Bot,
  Calendar,
  Check,
  Copy,
  FileSearch,
  Terminal,
  Wrench,
} from "lucide-react";

import StatusBadge from "@/components/analysis/StatusBadge";
import type { Analysis } from "@/types/analysis";

interface HistoryDetailsProps {
  investigation?: Analysis | null;
  loading?: boolean;
}

export default function HistoryDetails({
  investigation,
  loading,
}: HistoryDetailsProps) {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    if (!investigation?.fix_command) return;

    try {
      await navigator.clipboard.writeText(investigation.fix_command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <div className="surface min-h-[720px] animate-pulse" />;
  }

  if (!investigation) {
    return (
      <div className="surface flex min-h-[720px] items-center justify-center p-10">
        <div className="max-w-md text-center">
          <FileSearch size={42} className="mx-auto text-zinc-600" />

          <h2 className="mt-6 text-2xl font-semibold">
            Select an Investigation
          </h2>

          <p className="mt-3 leading-7 text-zinc-400">
            Choose an investigation from the left panel to view the complete
            analysis report.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="surface overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="border-b border-zinc-800 p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="label">Investigation Report</p>

            <div className="mt-4 flex items-center gap-3">
              <AlertTriangle size={26} className="shrink-0 text-red-500" />
              <h1 className="text-3xl font-bold">
                {investigation.error_type}
              </h1>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(investigation.created_at).toLocaleString()}
              </div>
            </div>
          </div>

          <StatusBadge source={investigation.analysis_source} />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 p-8">
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="flex items-center gap-3">
            <FileSearch size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold">Root Cause</h3>
          </div>

          <p className="mt-4 leading-7 text-zinc-300 whitespace-pre-line">
            {investigation.root_cause}
          </p>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="flex items-center gap-3">
            <Bot size={20} className="text-violet-400" />
            <h3 className="text-lg font-semibold">Explanation</h3>
          </div>

          <p className="mt-4 leading-7 text-zinc-300 whitespace-pre-line">
            {investigation.explanation}
          </p>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="flex items-center gap-3">
            <Wrench size={20} className="text-green-400" />
            <h3 className="text-lg font-semibold">Suggested Fix</h3>
          </div>

          <p className="mt-4 leading-7 text-zinc-300 whitespace-pre-line">
            {investigation.fix_suggestion}
          </p>
        </section>

        <section className="overflow-hidden rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-5 py-4">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-blue-400" />
              <span className="font-medium">Terminal Command</span>
            </div>

            <button
              onClick={copyCommand}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                copied
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-700 hover:bg-zinc-800"
              }`}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <pre className="overflow-x-auto bg-[#050505] p-6 text-green-400">
            <code className="font-mono text-[14px] leading-7">
              {investigation.fix_command}
            </code>
          </pre>
        </section>
      </div>
    </div>
  );
}