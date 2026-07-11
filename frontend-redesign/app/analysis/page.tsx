"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Background from "@/components/layout/Background";
import Navbar from "@/components/layout/Navbar";

import AnalysisCard from "@/components/analysis/AnalysisCard";
import PipelineStatus from "@/components/analysis/PipelineStatus";

import api from "@/lib/api";
import { getJobId } from "@/lib/session";

export default function AnalysisPage() {
  const router = useRouter();

  const [analysis, setAnalysis] = useState<any>(null);
  const [status, setStatus] = useState("PENDING");
  const [currentStep, setCurrentStep] =
  useState("LOG_RECEIVED");

  useEffect(() => {
    const jobId = getJobId();

    if (!jobId) {
      router.replace("/investigate");
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/jobs/${jobId}`);
        setStatus(response.data.status);
        setCurrentStep(
  response.data.current_step
);

        if (
  response.data.status.toLowerCase() === "completed" &&
  response.data.analysis
) {
  setAnalysis(response.data.analysis);
  clearInterval(interval);
}
        {
          setAnalysis(response.data.analysis);
          clearInterval(interval);
        }
      } catch (error) {
        console.error(error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <Background>
      <Navbar />

      <main className="container pt-30 pb-24">

        {/* Page Header */}

        <section className="mb-30">

          <p className="label">
            Investigation Report
          </p>

          <h1 className="mt-7 text-5xl font-bold tracking-tight">
            Pipeline Analysis
          </h1>

          <p className="mt-7 max-w-5xl text-lg leading-8 text-zinc-400">
            Review the detected failure, understand the root cause, inspect the explanation, and apply the generated fix.
          </p>

        </section>

        {/* Workspace */}

        <section
          className="
            grid
            gap-20
            items-start
            xl:grid-cols-[minmax(0,1.7fr)_360px]
          "
        >

          <AnalysisCard
            analysis={analysis}
            status={status}
          />

          <PipelineStatus
  status={status}
  currentStep={currentStep}
/>
        </section>

      </main>
    </Background>
  );
}