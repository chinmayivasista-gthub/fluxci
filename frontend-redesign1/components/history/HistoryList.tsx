"use client";

import { Bot, ChevronRight, Clock3, Search, ShieldCheck } from "lucide-react";
import type { Analysis } from "@/types/analysis";

interface HistoryListProps {
  investigations?: Analysis[];
  selectedId?: number;
  onSelect?: (id: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
}

export default function HistoryList({
  investigations = [],
  selectedId,
  onSelect,
  search,
  onSearchChange,
  totalCount,
}: HistoryListProps) {
  return (
    <div className="surface overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-800 p-6">
        <p className="label">Investigation Browser</p>
        <h2 className="mt-2 text-2xl font-semibold">History</h2>

        <div className="relative mt-5">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search investigations..."
            className="input pl-11"
          />
        </div>

        {totalCount > 0 && (
          <p className="mt-3 text-xs text-zinc-600">
            Showing {investigations.length} of {totalCount} investigation
            {totalCount === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {/* List */}
      <div className="max-h-[700px] overflow-y-auto">
        {investigations.length === 0 && (
          <div className="p-10 text-center">
            <Clock3 size={32} className="mx-auto text-zinc-600" />
            <p className="mt-5 text-zinc-400">
              {totalCount === 0
                ? "No investigations found."
                : "No investigations match your search."}
            </p>
          </div>
        )}

        {investigations.map((item) => {
          const active = item.id === selectedId;
          const gemini = item.analysis_source?.toLowerCase() === "gemini";

          return (
            <button
              key={item.id}
              onClick={() => onSelect?.(item.id)}
              className={`
                w-full
                border-b
                border-zinc-800
                p-5
                text-left
                transition

                ${active ? "bg-blue-600/10" : "hover:bg-zinc-900"}
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-medium">{item.error_type}</h3>

                  <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
                    <span>
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div
                    className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      gemini
                        ? "bg-violet-500/10 text-violet-300"
                        : "bg-emerald-500/10 text-emerald-300"
                    }`}
                  >
                    {gemini ? (
                      <Bot size={11} />
                    ) : (
                      <ShieldCheck size={11} />
                    )}
                    {gemini ? "Gemini AI" : "Rule Engine"}
                  </div>
                </div>

                <ChevronRight
                  size={18}
                  className="mt-1 shrink-0 text-zinc-600"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
