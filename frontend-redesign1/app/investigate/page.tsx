import Background from "@/components/layout/Background";
import Navbar from "@/components/layout/Navbar";

import LogInput from "@/components/investigation/LogInput";
import PipelineTimeline from "@/components/investigation/PipelineTimeline";
import SupportedPlatforms from "@/components/investigation/SupportedPlatforms";

export default function InvestigationPage() {
  return (
    <Background>
      <Navbar />

      <main className="mx-auto w-[94%] pt-8 pb-44">
        {/* Page Header */}
        <section className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/10 bg-blue-500/5 text-blue-400 text-xs font-semibold tracking-wider uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            AI-Powered Log Analysis
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Analyze CI/CD Pipeline Failures
          </h1>

          <p className="text-lg md:text-xl leading-relaxed text-zinc-400 max-w-3xl">
            Upload your CI/CD pipeline logs to identify failures, determine the
            root cause, and generate actionable fixes with deterministic rules
            and AI assistance when required.
          </p>
        </section>

        {/* Workspace */}
        <section
          className="
            mt-16
            md:mt-24
            grid
            gap-12
            lg:gap-16
            items-start
            grid-cols-1
            xl:grid-cols-[1.4fr_440px]
          "
        >
          {/* Left Column: Workspace */}
          <div className="space-y-12 md:space-y-16">
            <LogInput />

            <SupportedPlatforms />
          </div>

          {/* Right Column: Interactive Pipeline / Timeline */}
          <div className="xl:sticky xl:top-32">
            <PipelineTimeline />
          </div>
        </section>
      </main>
    </Background>
  );
}
