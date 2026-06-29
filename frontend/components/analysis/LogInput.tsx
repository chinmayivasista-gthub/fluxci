"use client";

import { useState } from "react";
import api from "@/lib/api";
import {
  AlertTriangle,
  Search,
  BookOpen,
  Wrench,
  Terminal,
  Bot,
  CheckCircle2,
} from "lucide-react";

interface Analysis {
  error_type: string;
  root_cause: string;
  explanation: string;
  fix_suggestion: string;
  fix_command: string;
  analysis_source: string;
}

export default function LogInput() {
  const [log, setLog] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function analyze() {
    if (!log.trim()) return;

    try {
      setLoading(true);
      setAnalysis(null);
      setError("");
      setStatus("Cleaning log...");

      const response = await api.post("/analyze", null, {
        params: { log },
      });

      const { job_id } = response.data;

      setStatus("Running deterministic analysis...");

      let completed = false;

      while (!completed) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const result = await api.get(`/jobs/${job_id}`);

        if (result.data.status === "completed") {
          completed = true;

          if (
            result.data.analysis.analysis_source === "gemini"
          ) {
            setStatus("Using AI fallback...");
          }

          setAnalysis(result.data.analysis);
          setStatus("Analysis completed.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Unable to analyze the log.");
    } finally {
      setLoading(false);
      setStatus("");
    }
  }
 async function copyCommand() {
  if (!analysis) return;

  await navigator.clipboard.writeText(analysis.fix_command);

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
}
  function resetAnalysis() {
  setAnalysis(null);
  setLog("");
  setError("");
  setStatus("");
  setLoading(false);
}

  return (
    <div className="space-y-6">
      <textarea
        value={log}
        disabled={loading}
        onChange={(e) => setLog(e.target.value)}
        placeholder="Paste your CI/CD log here..."
       className="h-96 w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm outline-none backdrop-blur transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <button
        onClick={analyze}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze Log"}
      </button>

      {loading && (
        <div className="flex items-center gap-3 text-blue-400">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-sm">{status}</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {/* {!analysis && !loading && (
        <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
            <p className="text-lg font-medium text-zinc-300">
            Paste your CI/CD log above to begin analysis.
            </p>

            <p className="mt-2 text-sm text-zinc-500">
            Supports GitHub Actions, Jenkins, GitLab CI and CircleCI logs.
            </p>
        </div>
        )} */}
            {!analysis && !loading && log.trim() === "" && (
        <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
          <p className="text-lg font-medium text-zinc-300">
            Paste your CI/CD log above to begin analysis.
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Supports GitHub Actions, Jenkins, GitLab CI and CircleCI logs.
          </p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-xl backdrop-blur">
          <div>
             Error Type

            <h2 className="mt-1 text-xl font-semibold">
              {analysis.error_type}
            </h2>
          </div>

          <div>
            <div className="flex items-center gap-2 text-zinc-500">
                <Search size={16} />
                <p className="text-xs uppercase tracking-widest">
                    Root Cause
                </p>
                </div>
            <p className="mt-1 text-zinc-300">
              {analysis.root_cause}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-zinc-500">
                <BookOpen size={16} />
                <p className="text-xs uppercase tracking-widest">
                    Explanation
                </p>
                </div>

            <p className="mt-1 text-zinc-300">
              {analysis.explanation}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-zinc-500">
                <Wrench size={16} />
                <p className="text-xs uppercase tracking-widest">
                    Fix Suggestion
                </p>
                </div>

            <p className="mt-1 text-zinc-300">
              {analysis.fix_suggestion}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-zinc-500">
                <Terminal size={16} />
                <p className="text-xs uppercase tracking-widest">
                    Command
                </p>
                </div>

            <div className="mt-2 space-y-3">
              <pre className="overflow-x-auto rounded-lg bg-black p-3">
                <code>{analysis.fix_command}</code>
              </pre>

              <button
                onClick={copyCommand}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm transition hover:border-zinc-500 hover:bg-zinc-800 active:scale-95"
                >
                {copied ? "✅ Copied to Clipboard" : "📋 Copy Command"}
                </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-500">
            {analysis.analysis_source === "deterministic" ? (
                <CheckCircle2 size={16} />
            ) : (
                <Bot size={16} />
            )}

            <span className="text-sm">
                Analysis Source
            </span>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                analysis.analysis_source === "deterministic"
                  ? "bg-green-600"
                  : "bg-blue-600"
              }`}
            >
              {analysis.analysis_source}
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={resetAnalysis}
              className="rounded-xl bg-zinc-800 px-5 py-2.5 font-medium transition hover:bg-zinc-700 active:scale-95"
            >
              New Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}