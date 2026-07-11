"use client";

import PipelineTimeline from "@/components/investigation/PipelineTimeline";

interface PipelineStatusProps {
  status: string;
  currentStep: string;
}

export default function PipelineStatus({
  status,
  currentStep,
}: PipelineStatusProps) {
  return (
    <div className="top-28">
      <PipelineTimeline
        status={status}
        currentStep={currentStep}
      />
    </div>
  );
}