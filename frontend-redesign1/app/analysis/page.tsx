"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw, Terminal } from "lucide-react";

import Background from "@/components/layout/Background";
import Navbar from "@/components/layout/Navbar";

import AnalysisCard from "@/components/analysis/AnalysisCard";
import PipelineStatus from "@/components/analysis/PipelineStatus";
import { STEP_KEYS } from "@/components/investigation/PipelineTimeline";

import api from "@/lib/api";
import { clearJobId, getJobId } from "@/lib/session";
import type { Analysis, Job } from "@/types/analysis";

const POLL_INTERVAL_MS = 1200;
const STEP_REVEAL_MS = 450;

export default function AnalysisPage() {
  const router = useRouter();

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [status, setStatus] = useState("PENDING");
  const [currentStep, setCurrentStep] = useState("LOG_RECEIVED");
  const [displayStepIndex, setDisplayStepIndex] = useState(0);
  const [connectionError, setConnectionError] = useState(false);

  const jobIdRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const revealIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const currentStepRef = useRef("LOG_RECEIVED");
  const statusRef = useRef("PENDING");

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stopReveal = useCallback(() => {
    if (revealIntervalRef.current) {
      clearInterval(revealIntervalRef.current);
      revealIntervalRef.current = null;
    }
  }, []);

  const poll = useCallback(
    async (id: string) => {
      try {
        const response = await api.get<Job>(`/jobs/${id}`);
        const data = response.data;

        setConnectionError(false);
        setStatus(data.status);
        setCurrentStep(data.current_step);
        statusRef.current = data.status;
        currentStepRef.current = data.current_step;

        const normalized = data.status?.toLowerCase();

        if (normalized === "completed") {
          setAnalysis(data.analysis ?? null);
          stopPolling();
        } else if (normalized === "failed") {
          stopPolling();
        }
      } catch (err) {
        console.error(err);
        setConnectionError(true);
      }
    },
    [stopPolling]
  );

  const startInvestigation = useCallback(
    (id: string) => {
      stopPolling();
      stopReveal();
      setAnalysis(null);
      setConnectionError(false);
      setStatus("PENDING");
      setCurrentStep("LOG_RECEIVED");
      setDisplayStepIndex(0);
      statusRef.current = "PENDING";
      currentStepRef.current = "LOG_RECEIVED";

      poll(id);
      intervalRef.current = setInterval(() => poll(id), POLL_INTERVAL_MS);

      revealIntervalRef.current = setInterval(() => {
        setDisplayStepIndex((prev) => {
          const targetIndex = Math.max(
            STEP_KEYS.indexOf(currentStepRef.current),
            0
          );
          const normalized = statusRef.current?.toLowerCase();
          const isTerminal =
            normalized === "completed" || normalized === "failed";

          if (prev < targetIndex) {
            const next = prev + 1;
            if (next >= targetIndex && isTerminal) {
              stopReveal();
            }
            return next;
          }

          if (prev >= targetIndex && isTerminal) {
            stopReveal();
          }

          return prev;
        });
      }, STEP_REVEAL_MS);
    },
    [poll, stopPolling, stopReveal]
  );

  useEffect(() => {
    const id = getJobId();

    if (!id) {
      router.replace("/investigate");
      return;
    }

    jobIdRef.current = id;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- starts polling for this job on mount
    startInvestigation(id);

    return () => {
      stopPolling();
      stopReveal();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRetryConnection() {
    if (jobIdRef.current) startInvestigation(jobIdRef.current);
  }

  function handleNewInvestigation() {
    clearJobId();
    router.push("/investigate");
  }

  const failed = status?.toLowerCase() === "failed";

  const targetStepIndex = Math.max(STEP_KEYS.indexOf(currentStep), 0);
  const isRealStatusTerminal =
    status?.toLowerCase() === "completed" || status?.toLowerCase() === "failed";
  const hasRevealCaughtUp = displayStepIndex >= targetStepIndex;
  const pipelineDisplayStatus =
    isRealStatusTerminal && hasRevealCaughtUp ? status : "RUNNING";

  const revealedAnalysis = hasRevealCaughtUp ? analysis : null;
  const revealedFailed = hasRevealCaughtUp && failed;

  return (
    <Background>
      <Navbar />

      <main className="container pt-16 pb-24 md:pt-20">
        {/* Page Header */}
        <section className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label">Investigation Report</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Pipeline Analysis
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
              Review the detected failure, understand the root cause, inspect
              the explanation, and apply the generated fix.
            </p>
          </div>

          <button
            onClick={handleNewInvestigation}
            className="inline-flex h-12 shrink-0 items-center gap-2.5 self-start rounded-xl border border-zinc-800 bg-zinc-900 px-5 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            <Terminal size={16} />
            New investigation
          </button>
        </section>

        {connectionError && (
          <div className="mb-8 flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-6 py-4 text-sm text-amber-300 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
            <p>
              Lost connection to the FluxCI backend while polling this job.
              Retrying automatically — you can also retry manually.
            </p>
            <button
              onClick={handleRetryConnection}
              className="inline-flex items-center gap-2 self-start rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 font-medium text-amber-200 transition hover:bg-amber-500/20 sm:self-auto"
            >
              <RefreshCcw size={14} />
              Retry now
            </button>
          </div>
        )}

        {/* Workspace */}
        <section className="grid items-start gap-10 xl:grid-cols-[minmax(0,1.7fr)_400px] xl:gap-28">
          <AnalysisCard
            analysis={revealedAnalysis}
            status={pipelineDisplayStatus}
            failed={revealedFailed}
          />

          <PipelineStatus
            status={pipelineDisplayStatus}
            currentStep={STEP_KEYS[displayStepIndex] ?? currentStep}
          />
        </section>
      </main>
    </Background>
  );
}
