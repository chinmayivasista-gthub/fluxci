import LogInput from "@/components/analysis/LogInput";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6">

        <div className="mb-12">
          <h1 className="text-5xl font-bold">
            FluxCI
          </h1>

          <p className="mt-3 text-zinc-400">
            Analyze CI/CD failures using deterministic rules with AI fallback.
          </p>
        </div>

        <LogInput />

      </div>
    </main>
  );
}