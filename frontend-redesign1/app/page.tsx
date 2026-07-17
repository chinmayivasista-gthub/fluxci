import Link from "next/link";
import {
  ArrowRight,
  Bot,
  ExternalLink,
  FileSearch,
  GitBranch,
  History,
  ShieldCheck,
  Sparkles,
  Terminal,
  Timer,
  Workflow,
  Zap,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Background from "@/components/layout/Background";

const stats = [
  { value: "< 4s", label: "Median investigation time" },
  { value: "10+", label: "Deterministic failure rules" },
  { value: "4", label: "CI/CD platforms supported" },
  { value: "100%", label: "Fixes with a ready command" },
];

const steps = [
  {
    icon: Terminal,
    title: "Paste your build log",
    description:
      "Drop the raw output from GitHub Actions, GitLab CI, Jenkins or CircleCI straight into the workspace — no formatting required.",
  },
  {
    icon: Workflow,
    title: "Deterministic rule engine runs first",
    description:
      "FluxCI cleans the log, isolates the failing stage, and checks it against a growing library of known failure signatures.",
  },
  {
    icon: Bot,
    title: "AI steps in when needed",
    description:
      "Unrecognized failures are escalated to an LLM-backed investigator that reasons about the stack trace and produces a fix.",
  },
  {
    icon: Terminal,
    title: "Ship the fix",
    description:
      "Get a plain-English root cause, a full explanation, and a copy-pasteable terminal command to resolve it.",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Deterministic first, AI second",
    description:
      "Known failures resolve instantly through rules — consistent, explainable, and free of hallucination risk.",
  },
  {
    icon: Sparkles,
    title: "AI fallback for the unknown",
    description:
      "Anything outside the rule set is handed to an AI investigator that reads the trace and reasons about root cause.",
  },
  {
    icon: FileSearch,
    title: "Root cause, not just symptoms",
    description:
      "Every report separates the surface error from the underlying cause, so fixes actually stick.",
  },
  {
    icon: GitBranch,
    title: "Works with your pipeline",
    description:
      "GitHub Actions, GitLab CI, Jenkins, and CircleCI logs are all parsed and normalized automatically.",
  },
  {
    icon: Timer,
    title: "Live investigation timeline",
    description:
      "Watch each analysis stage — from log cleaning to fix generation — complete in real time.",
  },
  {
    icon: History,
    title: "Full investigation history",
    description:
      "Every analysis is saved and searchable, so past failures and fixes are always one click away.",
  },
];

const platforms = [
  { name: "GitHub Actions", icon: GitBranch },
  { name: "GitLab CI", icon: Workflow },
  { name: "Jenkins", icon: Terminal },
  { name: "CircleCI", icon: Zap },
];

export default function LandingPage() {
  return (
    <Background>
      <Navbar />

      <main className="flex-1">
        {/* ============================================================= */}
        {/* HERO                                                          */}
        {/* ============================================================= */}
        <section className="container relative flex flex-col items-center justify-center pt-16 pb-10 text-center md:pt-20 md:pb-12">
          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
            AI-Powered CI/CD Failure Investigation
          </div>

          <h1
            className="animate-fade-in-up mt-8 max-w-4xl text-6xl font-extrabold tracking-tight text-white md:text-8xl"
            style={{ animationDelay: "80ms" }}
          >
            Stop reading
            <br />
            <span className="text-gradient">stack traces.</span>
          </h1>

          <p
            className="animate-fade-in-up mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            FluxCI turns a wall of CI/CD build log into a root cause,
            a plain-English explanation, and a fix you can run — in
            seconds, using a deterministic rule engine with AI assistance
            for the failures nobody has seen before.
          </p>

          <div
            className="animate-fade-in-up mt-11 flex flex-col items-center gap-4 sm:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/investigate"
              className="group inline-flex h-14 min-w-[220px] items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-8 text-base font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.16)_inset,0_10px_30px_-6px_rgba(37,99,235,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_14px_36px_-6px_rgba(37,99,235,0.65)] active:translate-y-0"
            >
              Analyze Logs
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/history"
              className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-8 text-base font-medium text-zinc-300 backdrop-blur transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            >
              <History size={18} />
              View Past Investigations
            </Link>
          </div>

          {/* Stat strip */}
          <div
            className="animate-fade-in-up mt-14 grid w-full max-w-4xl grid-cols-2 gap-6 md:grid-cols-4"
            style={{ animationDelay: "320ms" }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-zinc-800/70 bg-zinc-950/50 px-4 py-6 backdrop-blur"
              >
                <p className="text-2xl font-bold text-white md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-xs leading-snug text-zinc-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================= */}
        {/* HOW IT WORKS                                                  */}
        {/* ============================================================= */}
        <section className="container pt-14 pb-12 md:pt-16 md:pb-14">
          <div className="mx-auto max-w-2xl text-center">
            <p className="label">How it works</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              From raw log to shipped fix
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Four stages, fully automated, with a human-readable report
              at the end of it.
            </p>
          </div>

          <div className="relative mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {/* connecting line for desktop */}
            <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent xl:block" />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="group relative flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-950/70 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-[0_20px_60px_-24px_rgba(37,99,235,0.4)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-blue-400 transition-colors group-hover:border-blue-500/40 group-hover:bg-blue-500/10">
                      <Icon size={19} />
                    </div>
                    <span className="font-mono text-sm text-zinc-600">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">
                    {step.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================= */}
        {/* FEATURES                                                      */}
        {/* ============================================================= */}
        <section className="container pt-12 pb-14 md:pt-14 md:pb-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="label">Why FluxCI</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Built for engineers who
              <br className="hidden sm:block" /> hate flaky pipelines
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-950/60 p-7 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/60"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-blue-400 transition-colors group-hover:border-blue-500/40 group-hover:bg-blue-500/10">
                    <Icon size={19} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================= */}
        {/* PLATFORMS                                                     */}
        {/* ============================================================= */}
        <section className="container pt-8 pb-12 md:pt-10 md:pb-14">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 px-8 py-10 text-center md:px-16 md:py-12">
            <p className="label">Supported platforms</p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Bring logs from anywhere in your stack
            </h3>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div
                    key={platform.name}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-zinc-700 bg-[#111827] px-5 py-3 text-sm font-medium transition-all hover:border-blue-500 hover:bg-[#172033]"
                  >
                    <Icon size={16} className="text-blue-400" />
                    {platform.name}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================= */}
        {/* FINAL CTA                                                     */}
        {/* ============================================================= */}
        <section className="container pt-2 pb-20 md:pb-24">
          <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 via-zinc-950 to-zinc-950 px-8 py-12 text-center md:px-16 md:py-14">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]" />

            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Your next red build is already fixable.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400">
                Paste the log and let FluxCI tell you exactly what broke —
                and how to fix it.
              </p>

              <Link
                href="/investigate"
                className="group mt-8 inline-flex h-14 min-w-[240px] items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-8 text-base font-semibold text-white shadow-[0_1px_0_rgba(255,255,255,0.16)_inset,0_10px_30px_-6px_rgba(37,99,235,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500"
              >
                Start an Investigation
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =================================================================== */}
      {/* FOOTER                                                               */}
      {/* =================================================================== */}
      <footer className="border-t border-zinc-900">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-zinc-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} FluxCI. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link
              href="/history"
              className="transition hover:text-zinc-300"
            >
              History
            </Link>
            <Link
              href="/investigate"
              className="transition hover:text-zinc-300"
            >
              Investigate
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-zinc-300"
            >
              <ExternalLink size={15} />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </Background>
  );
}
