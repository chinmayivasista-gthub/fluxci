"use client";

import {
  Activity,
  Bot,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface PipelineStatusProps {
  loading: boolean;
  status: string;
  analysisSource?: string;
}

export default function PipelineStatus({
  loading,
  status,
  analysisSource,
}: PipelineStatusProps) {
  return (
    <div className="surface overflow-hidden">
      <div className="workspace-header">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />

          <div>
            <p className="muted-label">
              Pipeline Status
            </p>

            <h3 className="text-sm font-semibold">
              Live Backend Activity
            </h3>
          </div>
        </div>
      </div>

      <div className="workspace-content">

        {loading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />

            <div>
              <p className="font-medium">
                Processing Investigation
              </p>

              <p className="text-sm text-muted-foreground">
                {status || "Waiting..."}
              </p>
            </div>
          </div>
        ) : analysisSource ? (
          <div className="flex items-center gap-3">

            {analysisSource === "gemini" ? (
              <Bot className="h-5 w-5 text-blue-500" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            )}

            <div>
              <p className="font-medium">
                Investigation Complete
              </p>

              <p className="text-sm text-muted-foreground">
                {analysisSource === "gemini"
                  ? "Resolved using Gemini AI"
                  : "Resolved using Deterministic Engine"}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Waiting for a new investigation...
          </div>
        )}

      </div>
    </div>
  );
}