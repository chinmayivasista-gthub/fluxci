import HistoryTable from "@/components/history/HistoryTable";

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-8 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-5xl font-bold">History</h1>

        <p className="mt-3 text-zinc-400">
          Browse previous CI/CD analyses.
        </p>

        <div className="mt-10">
          <HistoryTable />
        </div>
      </div>
    </main>
  );
}