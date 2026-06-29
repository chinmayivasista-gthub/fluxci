import LogInput from "@/components/analysis/LogInput";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6">

        <div className="mb-12">
         <h1 className="text-6xl font-bold tracking-tight">
            FluxCI
          </h1>

          <p className="mt-5 max-w-2xl text-zinc-400 text-lg leading-8">
            AI-powered CI/CD failure analyzer using deterministic rules with intelligent
            AI fallback.
          </p>
        </div>

        <LogInput />

      </div>
    </main>
  );
}