import LogInput from "@/components/analysis/LogInput";
import {
  BrainCircuit,
  GitBranch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* Hero */}

        <section className="mb-16 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <Sparkles size={16} />
            AI-Powered CI/CD Failure Analyzer
          </div>

          <h1 className="text-6xl font-extrabold tracking-tight">
            FluxCI
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
            Analyze CI/CD failures in seconds using a deterministic rule engine
            with intelligent Gemini fallback for unknown build failures.
          </p>
        </section>

        {/* Feature Cards */}

        <section className="mb-14 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
            <BrainCircuit
              className="mb-4 text-blue-400"
              size={34}
            />

            <h3 className="text-xl font-semibold">
              Deterministic Engine
            </h3>

            <p className="mt-2 text-sm leading-7 text-zinc-400">
              Detects common CI failures instantly using handcrafted rules before
              invoking AI.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
            <ShieldCheck
              className="mb-4 text-green-400"
              size={34}
            />

            <h3 className="text-xl font-semibold">
              AI Fallback
            </h3>

            <p className="mt-2 text-sm leading-7 text-zinc-400">
              Unknown failures are analyzed by Gemini and converted into
              structured debugging suggestions.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
            <GitBranch
              className="mb-4 text-purple-400"
              size={34}
            />

            <h3 className="text-xl font-semibold">
              CI Platforms
            </h3>

            <p className="mt-2 text-sm leading-7 text-zinc-400">
              Supports GitHub Actions, Jenkins, GitLab CI and CircleCI logs.
            </p>
          </div>

        </section>

        {/* Main Content */}

        <section className="grid gap-8 lg:grid-cols-3">

          {/* Analyzer */}

          <div className="lg:col-span-2">
            <LogInput />
          </div>

          {/* Pipeline */}

          <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 backdrop-blur">

            <h2 className="mb-8 text-xl font-semibold">
              Analysis Pipeline
            </h2>

            <div className="space-y-6">

              <PipelineStep
                emoji="🧹"
                title="Log Cleaning"
              />

              <PipelineStep
                emoji="📚"
                title="Stack Trace Extraction"
              />

              <PipelineStep
                emoji="🐍"
                title="Language Detection"
              />

              <PipelineStep
                emoji="⚙️"
                title="Deterministic Rule Engine"
              />

              <PipelineStep
                emoji="🤖"
                title="Gemini AI Fallback"
              />

            </div>

          </aside>

        </section>

      </div>
    </main>
  );
}

function PipelineStep({
  emoji,
  title,
}: {
  emoji: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4">

      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-xl">
        {emoji}
      </div>

      <div>

        <p className="font-medium">
          {title}
        </p>

        <p className="text-sm text-zinc-500">
          Completed during analysis
        </p>

      </div>

    </div>
  );
}