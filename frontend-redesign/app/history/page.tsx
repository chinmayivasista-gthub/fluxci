"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

import Background from "@/components/layout/Background";
import Navbar from "@/components/layout/Navbar";

import HistoryList from "@/components/history/HistoryList";
import HistoryDetails from "@/components/history/HistoryDetails";

interface Investigation {
  id: number;
  error_type: string;
  root_cause: string;
  explanation: string;
  fix_suggestion: string;
  fix_command: string;
  analysis_source: string;
  created_at: string;
}

export default function HistoryPage() {
  const [investigations, setInvestigations] =
    useState<Investigation[]>([]);

  const [selectedId, setSelectedId] =
    useState<number>();

  const [selectedInvestigation, setSelectedInvestigation] =
    useState<Investigation | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function loadHistory() {
    try {
      const response = await api.get("/history");

      setInvestigations(response.data);

      if (response.data.length > 0) {
        setSelectedId(response.data[0].id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function loadInvestigation(
    id: number
  ) {
    try {
      const response = await api.get(
        `/history/${id}`
      );

      setSelectedInvestigation(
        response.data
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (selectedId !== undefined) {
      loadInvestigation(selectedId);
    }
  }, [selectedId]);

  return (
    <Background>
      <Navbar />

      <main className="container py-14">

        {/* Header */}

        <section className="mb-10">

          <p className="label">
            Investigation Browser
          </p>

          <h1 className="mt-3 text-5xl font-bold">
            Investigation History
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            Browse previous CI/CD failures,
            review investigation reports,
            and revisit generated fixes.
          </p>

        </section>

        {loading ? (

          <div className="surface p-10 text-center">

            Loading investigations...

          </div>

        ) : (

          <section
            className="
              grid
              gap-8
              xl:grid-cols-[420px_minmax(0,1fr)]
              items-start
            "
          >

            <HistoryList
              investigations={
                investigations
              }
              selectedId={selectedId}
              onSelect={setSelectedId}
            />

            <HistoryDetails
              investigation={
                selectedInvestigation
              }
            />

          </section>

        )}

      </main>

    </Background>
  );
}