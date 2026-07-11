"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Eraser,
  FileText,
  Play,
  Terminal as TerminalIcon,
} from "lucide-react";

import api from "@/lib/api";
import { saveJobId } from "@/lib/session";

export default function LogInput() {
  const [log, setLog] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const characters = useMemo(
    () => log.length,
    [log]
  );

  function clearLog() {
    if (loading) return;
    setLog("");
  }

  async function analyzeLog() {
    if (!log.trim()) return;

    try {
      setLoading(true);

      const response = await api.post(
        "/analyze",
        null,
        {
          params: {
            log,
          },
        }
      );

      saveJobId(response.data.job_id);

      router.push("/analysis");
    } catch (error) {
      console.error(error);

      alert(
        "Unable to start investigation."
      );

      setLoading(false);
    }
  }

  return (
    <section className="surface overflow-hidden border border-zinc-800/80 bg-gradient-to-b from-zinc-950/50 to-zinc-900/30 shadow-2xl">
      {/* Header */}
      <div className="border-b border-zinc-800/80 px-8 py-8 md:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-md shadow-blue-500/5">
            <TerminalIcon size={18} className="text-blue-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Log Analyzer
          </h2>
        </div>

        <p className="mt-4 max-w-4xl text-sm md:text-base leading-relaxed text-zinc-400">
          Paste your complete CI/CD pipeline log below. FluxCI&apos;s advanced parser will clean the output, isolate runtime exceptions, trace the failing execution thread, and deliver a deterministic fix.
        </p>
      </div>

      {/* Editor Space (Felt as primary workspace) */}
      <div className="px-8 py-8 md:px-10">
        <div className="relative flex flex-col rounded-2xl border border-zinc-800/90 bg-[#020204] shadow-2xl shadow-black/50">
          {/* Editor Chrome Header (Visual wrapper) */}
          <div className="flex items-center justify-between border-b border-zinc-900/80 bg-zinc-950/90 px-5 py-4 select-none">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/40 hover:bg-red-500 transition-colors" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/40 hover:bg-yellow-500 transition-colors" />
              <span className="h-3 w-3 rounded-full bg-green-500/40 hover:bg-green-500 transition-colors" />
            </div>
            
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <span className="text-blue-400">⚡</span>
              <span>active-workspace.log</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Editor Active</span>
            </div>
          </div>

          {/* Textarea Workspace */}
          <div className="relative flex-1">
            <textarea
              value={log}
              onChange={(e) => setLog(e.target.value)}
              placeholder="Paste your GitHub Actions, Jenkins, GitLab CI or CircleCI build log here..."
              className="
                w-full
                h-[550px]
                md:h-[620px]
                resize-none
                bg-transparent
                p-6
                md:p-8
                font-mono
                text-[13px]
                md:text-[14px]
                leading-relaxed
                text-zinc-100
                placeholder:text-zinc-700
                focus:outline-none
                overflow-y-auto
                selection:bg-blue-500/20
              "
            />
          </div>

          {/* Editor Status Bar */}
          <div className="flex items-center justify-between border-t border-zinc-900 bg-zinc-950/60 px-5 py-3 font-mono text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-zinc-600" />
              <span>
                {characters.toLocaleString()} characters
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${log.trim() === "" ? "bg-zinc-600" : "bg-blue-500 animate-pulse"}`} />
              <span>
                {log.trim() === ""
                  ? "Waiting for logs..."
                  : "Ready for deep analysis"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-t border-zinc-800/80 bg-zinc-950/20 px-8 py-8 md:px-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={clearLog}
            disabled={loading || log.length === 0}
            className="
              flex
              h-14
              items-center
              justify-center
              gap-2.5
              rounded-xl
              border
              border-zinc-800
              bg-zinc-900/60
              px-6
              text-sm
              font-semibold
              text-zinc-400
              hover:border-zinc-700
              hover:bg-zinc-800
              hover:text-white
              active:scale-[0.98]
              disabled:opacity-30
              disabled:cursor-not-allowed
              disabled:transform-none
              transition-all
              duration-200
            "
          >
            <Eraser size={16} />
            <span>Clear Workspace</span>
          </button>

          <button
            onClick={analyzeLog}
            disabled={loading || log.trim() === ""}
            className="
              flex
              h-14
              min-w-[240px]
              items-center
              justify-center
              gap-2.5
              rounded-xl
              bg-gradient-to-b
              from-blue-600
              to-blue-500
              px-8
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-blue-500/10
              hover:from-blue-500
              hover:to-blue-400
              hover:shadow-blue-500/20
              hover:-translate-y-0.5
              active:translate-y-0
              active:scale-[0.99]
              disabled:opacity-40
              disabled:cursor-not-allowed
              disabled:transform-none
              disabled:shadow-none
              transition-all
              duration-200
            "
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                <span>Running Investigation...</span>
              </>
            ) : (
              <>
                <Play size={15} fill="currentColor" />
                <span>Start AI Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}