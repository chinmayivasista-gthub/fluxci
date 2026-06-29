"use client";

import { useState } from "react";
import api from "@/lib/api";

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
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  async function analyze() {
    if (!log.trim()) return;

    try {
      setLoading(true);
      setAnalysis(null);

      const response = await api.post("/analyze", null, {
        params: { log },
      });

      const { job_id } = response.data;

      let completed = false;

      while (!completed) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const result = await api.get(`/jobs/${job_id}`);

        if (result.data.status === "completed") {
          completed = true;
          setAnalysis(result.data.analysis);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <textarea
        value={log}
        onChange={(e) => setLog(e.target.value)}
        placeholder="Paste your CI/CD log here..."
        className="h-96 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-sm outline-none focus:border-blue-500"
      />

      <button
        onClick={analyze}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze Log"}
      </button>

      {analysis && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Error Type
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              {analysis.error_type}
            </h2>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Root Cause
            </p>
            <p className="mt-1 text-zinc-300">
              {analysis.root_cause}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Explanation
            </p>
            <p className="mt-1 text-zinc-300">
              {analysis.explanation}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Fix Suggestion
            </p>
            <p className="mt-1 text-zinc-300">
              {analysis.fix_suggestion}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Command
            </p>

            <pre className="mt-2 rounded-lg bg-black p-3 overflow-x-auto">
              <code>{analysis.fix_command}</code>
            </pre>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">
              Analysis Source
            </span>

            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold">
              {analysis.analysis_source}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}