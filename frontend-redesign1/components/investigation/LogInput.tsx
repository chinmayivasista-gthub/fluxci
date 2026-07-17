"use client";

import { useMemo, useRef, useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";

import {
  AlertCircle,
  Eraser,
  FileText,
  Play,
  Terminal as TerminalIcon,
  Upload,
  Wand2,
} from "lucide-react";

import api from "@/lib/api";
import { saveJobId } from "@/lib/session";

const SAMPLE_LOG = `Run npm test
> project@1.0.0 test
> jest --coverage

 FAIL  src/services/paymentService.test.ts
  PaymentService
    ✕ processes a valid payment (14 ms)

  ● PaymentService › processes a valid payment

    TypeError: Cannot read properties of undefined (reading 'amount')

      22 |   async function charge(payload) {
      23 |     const gateway = await connect();
    > 24 |     return gateway.charge(payload.amount);
         |                           ^
      25 |   }

      at charge (src/services/paymentService.ts:24:27)
      at Object.<anonymous> (src/services/paymentService.test.ts:18:5)

Test Suites: 1 failed, 12 passed, 13 total
Tests:       1 failed, 87 passed, 88 total
Error: Process completed with exit code 1.`;

export default function LogInput() {
  const [log, setLog] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const characters = useMemo(() => log.length, [log]);
  const isEmpty = log.trim() === "";

  function clearLog() {
    if (loading) return;
    setLog("");
    setError(null);
  }

  function loadSample() {
    if (loading) return;
    setLog(SAMPLE_LOG);
    setError(null);
  }

  function readFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLog(reader.result);
        setError(null);
      }
    };
    reader.readAsText(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (loading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  }

  async function analyzeLog() {
    if (!log.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/analyze", null, {
        params: { log },
      });

      saveJobId(response.data.job_id);
      router.push("/analysis");
    } catch (err) {
      console.error(err);
      setError(
        "Unable to start the investigation. Confirm the FluxCI backend is running and try again."
      );
      setLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_20px_60px_-20px_rgba(0,0,0,0.6)]">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-zinc-800 px-8 py-9 md:flex-row md:items-start md:justify-between md:px-12 md:py-11">
        <div>
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
              <TerminalIcon size={19} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Log Analyzer
            </h2>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-[15px]">
            Paste your complete CI/CD pipeline log below. FluxCI&apos;s parser
            cleans the output, isolates runtime exceptions, traces the failing
            execution thread, and delivers a deterministic fix.
          </p>
        </div>

        <div className="flex shrink-0 gap-2.5">
          <button
            onClick={loadSample}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white disabled:pointer-events-none disabled:opacity-40"
          >
            <Wand2 size={14} />
            Load sample log
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white disabled:pointer-events-none disabled:opacity-40"
          >
            <Upload size={14} />
            Upload file
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".log,.txt,text/plain"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Editor Space */}
      <div className="px-8 py-10 md:px-12 md:py-12">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!loading) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            relative flex flex-col overflow-hidden rounded-xl border bg-black
            shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] transition-colors duration-200
            ${
              isDragging
                ? "border-blue-500/60 ring-2 ring-blue-500/20"
                : "border-zinc-800 focus-within:border-zinc-700"
            }
          `}
        >
          {/* Editor Chrome Header */}
          <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-950 px-5 py-3.5 select-none">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </div>

            <div className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 font-mono text-xs text-zinc-400">
              <span className="text-blue-400">⚡</span>
              <span>active-workspace.log</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                Editor active
              </span>
            </div>
          </div>

          {/* Textarea Workspace */}
          <div className="relative flex-1">
            {isEmpty && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-900 bg-zinc-950">
                  <FileText size={22} className="text-zinc-700" />
                </div>
                <p className="text-sm font-medium text-zinc-600">
                  No log loaded yet
                </p>
                <p className="max-w-xs text-xs leading-relaxed text-zinc-700">
                  Paste output from GitHub Actions, Jenkins, GitLab CI or
                  CircleCI — or drag a .log file into this window.
                </p>
              </div>
            )}

            <textarea
              value={log}
              onChange={(e) => {
                setLog(e.target.value);
                if (error) setError(null);
              }}
              placeholder=""
              className="
                relative
                z-10
                w-full
                h-[550px]
                md:h-[620px]
                resize-none
                bg-transparent
                p-7
                md:p-9
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
          <div className="flex items-center justify-between border-t border-zinc-900 bg-zinc-950 px-5 py-3.5 font-mono text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <FileText size={13} className="text-zinc-600" />
              <span>{characters.toLocaleString()} characters</span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isEmpty ? "bg-zinc-700" : "bg-blue-500 animate-pulse"
                }`}
              />
              <span>
                {isEmpty ? "Waiting for logs…" : "Ready for deep analysis"}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-300 animate-fade-in-up">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="border-t border-zinc-800 bg-zinc-950 px-8 py-9 md:px-12 md:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              bg-zinc-900
              px-6
              text-sm
              font-medium
              text-zinc-400
              transition-all
              duration-200
              hover:border-zinc-700
              hover:bg-zinc-800
              hover:text-zinc-100
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-30
              disabled:active:scale-100
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-zinc-600
              focus-visible:ring-offset-2
              focus-visible:ring-offset-zinc-950
            "
          >
            <Eraser size={16} />
            <span>Clear workspace</span>
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
              bg-blue-600
              px-8
              text-sm
              font-semibold
              text-white
              shadow-[0_1px_0_rgba(255,255,255,0.16)_inset,0_8px_24px_-6px_rgba(37,99,235,0.5)]
              transition-all
              duration-200
              hover:bg-blue-500
              hover:shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_10px_30px_-6px_rgba(37,99,235,0.6)]
              hover:-translate-y-0.5
              active:translate-y-0
              active:scale-[0.99]
              disabled:cursor-not-allowed
              disabled:opacity-40
              disabled:translate-y-0
              disabled:shadow-none
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-500
              focus-visible:ring-offset-2
              focus-visible:ring-offset-zinc-950
            "
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                <span>Running investigation…</span>
              </>
            ) : (
              <>
                <Play size={15} fill="currentColor" />
                <span>Start AI analysis</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
