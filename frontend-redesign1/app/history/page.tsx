"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";

import api from "@/lib/api";

import Background from "@/components/layout/Background";
import Navbar from "@/components/layout/Navbar";

import HistoryList from "@/components/history/HistoryList";
import HistoryDetails from "@/components/history/HistoryDetails";
import type { Analysis } from "@/types/analysis";

export default function HistoryPage() {
  const [investigations, setInvestigations] = useState<Analysis[]>([]);
  const [selectedId, setSelectedId] = useState<number>();
  const [selectedInvestigation, setSelectedInvestigation] =
    useState<Analysis | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadHistory() {
    try {
      setLoading(true);
      setLoadError(null);

      const response = await api.get<Analysis[]>("/history");
      setInvestigations(response.data);

      if (response.data.length > 0) {
        setSelectedId(response.data[0].id);
      }
    } catch (error) {
      console.error(error);
      setLoadError(
        "Unable to load investigation history. Confirm the FluxCI backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadInvestigation(id: number) {
    try {
      setDetailLoading(true);
      const response = await api.get<Analysis>(`/history/${id}`);
      setSelectedInvestigation(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadHistory();
  }, []);

  useEffect(() => {
    if (selectedId !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch details when selection changes
      loadInvestigation(selectedId);
    }
  }, [selectedId]);

  const filteredInvestigations = useMemo(() => {
    if (!search.trim()) return investigations;
    const query = search.trim().toLowerCase();

    return investigations.filter((item) =>
      [item.error_type, item.analysis_source, item.root_cause]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query))
    );
  }, [investigations, search]);

  return (
    <Background>
      <Navbar />

      <main className="container pt-16 pb-24 md:pt-20">
        {/* Header */}
        <section className="mb-12 md:mb-16">
          <p className="label">Investigation Browser</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Investigation History
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            Browse previous CI/CD failures, review investigation reports, and
            revisit generated fixes.
          </p>
        </section>

        {loadError && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-6 py-4 text-sm text-red-300">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <p>{loadError}</p>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)] xl:gap-24">
            <div className="surface h-[500px] animate-pulse" />
            <div className="surface h-[500px] animate-pulse" />
          </div>
        ) : (
          <section className="grid items-start gap-8 xl:grid-cols-[420px_minmax(0,1fr)] xl:gap-24">
            <HistoryList
              investigations={filteredInvestigations}
              selectedId={selectedId}
              onSelect={setSelectedId}
              search={search}
              onSearchChange={setSearch}
              totalCount={investigations.length}
            />

            <HistoryDetails
              investigation={selectedInvestigation}
              loading={detailLoading}
            />
          </section>
        )}
      </main>
    </Background>
  );
}
