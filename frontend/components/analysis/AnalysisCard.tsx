import {
  Search,
  BookOpen,
  Wrench,
  AlertTriangle,
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

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({
  icon,
  title,
  children,
}: SectionProps) {
  return (
    <section className="surface overflow-hidden">
      <div className="workspace-header">
        <div className="flex items-center gap-2">
          {icon}

          <div>
            <p className="muted-label">{title}</p>
          </div>
        </div>
      </div>

      <div className="workspace-content">
        <div className="leading-7 text-sm text-foreground">
          {children}
        </div>
      </div>
    </section>
  );
}

export default function AnalysisCard({
  analysis,
  onNewAnalysis,
}: AnalysisCardProps) {
  return (
    <div className="space-y-6">

      <section className="surface overflow-hidden">
        <div className="workspace-header">
          <div className="flex items-start gap-3">
            <div className="rounded-lg border p-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>

            <div>
              <p className="muted-label">
                Analysis Result
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                {analysis.error_type}
              </h2>
            </div>
          </div>

          <StatusBadge source={analysis.analysis_source} />
        </div>
      </section>

      <Section
        icon={<Search className="h-4 w-4 text-muted-foreground" />}
        title="Root Cause"
      >
        {analysis.root_cause}
      </Section>

      <Section
        icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        title="Explanation"
      >
        {analysis.explanation}
      </Section>

      <Section
        icon={<Wrench className="h-4 w-4 text-muted-foreground" />}
        title="Fix Suggestion"
      >
        {analysis.fix_suggestion}
      </Section>

      <CommandSection
        command={analysis.fix_command}
      />

      <button
        onClick={onNewAnalysis}
        className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground transition hover:opacity-90"
      >
        New Investigation
      </button>

    </div>
  );
}