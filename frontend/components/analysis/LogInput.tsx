
"use client";

import { useState } from "react";
import api from "@/lib/api";
import AnalysisCard from "./AnalysisCard";

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
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function analyze() {
    if (!log.trim()) return;

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);
      setStatus("Receiving log...");

      const response = await api.post("/analyze", null, {
        params: { log },
      });

      const { job_id } = response.data;

      const stages = [
        "Cleaning log...",
        "Extracting stack trace...",
        "Locating failure section...",
        "Running deterministic rules..."
      ];

      let completed = false;
      let index = 0;

      while (!completed) {
        setStatus(stages[Math.min(index, stages.length - 1)]);
        index++;
        await new Promise((r) => setTimeout(r, 1000));

        const result = await api.get(`/jobs/${job_id}`);

        if (result.data.status === "completed") {
          const data = result.data.analysis as Analysis;

          if (data.analysis_source === "gemini") {
            setStatus("Running Gemini...");
          } else {
            setStatus("Generating report...");
          }

          setAnalysis(data);
          completed = true;
        }
      }

      setStatus("");
    } catch {
      setError("Unable to analyze the log.");
    } finally {
      setLoading(false);
    }
  }

  function resetAnalysis() {
    setAnalysis(null);
    setLog("");
    setStatus("");
    setError("");
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <section className="surface">
        <div className="workspace-header">
          <div>
            <p className="muted-label">Log Input</p>
            <h2 className="text-lg font-semibold">Paste CI/CD Log</h2>
          </div>
        </div>

        <div className="workspace-content space-y-4">
          <textarea
            value={log}
            disabled={loading}
            onChange={(e) => setLog(e.target.value)}
            placeholder="Paste your CI/CD log here..."
            className="h-96 w-full resize-none rounded-xl border bg-background p-4 mono text-sm"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={analyze}
              disabled={loading || !log.trim()}
              className="rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze Log"}
            </button>

            {status && (
              <span className="text-sm text-muted-foreground">{status}</span>
            )}
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>
      </section>

      {analysis && (
        <AnalysisCard
          analysis={analysis}
          onNewAnalysis={resetAnalysis}
        />
      )}
    </div>
  );
}
