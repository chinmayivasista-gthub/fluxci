"use client";

import {
  Clock3,
  ChevronRight,
  Search,
} from "lucide-react";

interface HistoryItem {
  id: number;
  error_type: string;
  analysis_source: string;
  created_at: string;
}

interface HistoryListProps {
  investigations?: HistoryItem[];
  selectedId?: number;
  onSelect?: (id: number) => void;
}

export default function HistoryList({
  investigations = [],
  selectedId,
  onSelect,
}: HistoryListProps) {
  return (
    <div className="surface overflow-hidden">

      {/* Header */}

      <div className="border-b border-zinc-800 p-6">

        <p className="label">
          Investigation Browser
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          History
        </h2>

        <div className="relative mt-5">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            placeholder="Search investigations..."
            className="
              input
              pl-11
            "
          />

        </div>

      </div>

      {/* List */}

      <div className="max-h-[700px] overflow-y-auto">

        {investigations.length === 0 && (

          <div className="p-10 text-center">

            <Clock3
              size={32}
              className="mx-auto text-zinc-600"
            />

            <p className="mt-5 text-zinc-400">
              No investigations found.
            </p>

          </div>

        )}

        {investigations.map((item) => {

          const active =
            item.id === selectedId;

          return (

            <button
              key={item.id}
              onClick={() =>
                onSelect?.(item.id)
              }
              className={`
                w-full
                border-b
                border-zinc-800
                p-5
                text-left
                transition

                ${
                  active
                    ? "bg-blue-600/10"
                    : "hover:bg-zinc-900"
                }
              `}
            >

              <div className="flex items-start justify-between">

                <div>

                  <h3 className="font-medium">

                    {item.error_type}

                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">

                    {new Date(
                      item.created_at
                    ).toLocaleString()}

                  </p>

                </div>

                <ChevronRight
                  size={18}
                  className="text-zinc-600"
                />

              </div>

            </button>

          );

        })}

      </div>

    </div>
  );
}