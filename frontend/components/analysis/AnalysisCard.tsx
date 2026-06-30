import {
  Search,
  BookOpen,
  Wrench,
} from "lucide-react";

import CommandSection from "./CommandSection";
import StatusBadge from "./StatusBadge";

interface Analysis {
  error_type: string;
  root_cause: string;
  explanation: string;
  fix_suggestion: string;
  fix_command: string;
  analysis_source: string;
}

interface AnalysisCardProps {
  analysis: Analysis;
  onNewAnalysis: () => void;
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-zinc-400">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-widest">
          {title}
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
        {children}
      </div>
    </div>
  );
}

export default function AnalysisCard({
  analysis,
  onNewAnalysis,
}: AnalysisCardProps) {
  return (
    <div className="space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-xl backdrop-blur">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-zinc-500">
            Analysis Result
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {analysis.error_type}
          </h2>
        </div>

        <StatusBadge
          source={analysis.analysis_source}
        />

      </div>

      <Section
        icon={<Search size={16} />}
        title="Root Cause"
      >
        <p>{analysis.root_cause}</p>
      </Section>

      <Section
        icon={<BookOpen size={16} />}
        title="Explanation"
      >
        <p>{analysis.explanation}</p>
      </Section>

      <Section
        icon={<Wrench size={16} />}
        title="Fix Suggestion"
      >
        <p>{analysis.fix_suggestion}</p>
      </Section>

      <CommandSection
        command={analysis.fix_command}
      />

      <button
        onClick={onNewAnalysis}
        className="w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-500"
      >
        Analyze Another Log
      </button>

    </div>
  );
}