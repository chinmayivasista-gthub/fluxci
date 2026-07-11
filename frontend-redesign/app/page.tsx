import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Background from "@/components/layout/Background";

export default function LandingPage() {
  return (
    <Background>
      <Navbar />

      <main className="container flex min-h-[calc(100vh-64px)] items-center justify-center">
        <section className="mx-auto max-w-3xl text-center">

          <p className="mb-5 text-sm uppercase tracking-[0.35em] text-zinc-500">
            AI Powered CI/CD Failure Investigation
          </p>

          <h1 className="mb-6 text-7xl font-bold tracking-tight text-white">
            FluxCI
          </h1>

          <p className="mx-auto mb-12 max-w-xl text-lg leading-8 text-zinc-400">
            Analyze CI/CD logs in seconds using a deterministic rule engine with
            AI fallback for unknown build failures.
          </p>

          <Link
            href="/investigate"
            className="inline-flex items-center rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-500"
          >
            Analyze Logs →
          </Link>

        </section>
      </main>
    </Background>
  );
}