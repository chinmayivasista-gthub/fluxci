"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Analysis {
  id: number;
  job_id: string;
  error_type: string;
  root_cause: string;
  explanation: string;
  fix_suggestion: string;
  fix_command: string;
  analysis_source: string;
  created_at: string;
}

export default function HistoryTable() {
  const [history, setHistory] = useState<Analysis[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      const endpoint =
        search.trim() === ""
          ? "/history"
          : `/history/search?q=${encodeURIComponent(search)}`;
      setLoading(true);
      const response = await api.get(endpoint);

      setHistory(response.data);
      setLoading(false);
    }

    loadHistory();
  }, [search]);

  return (
    <>
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search analyses..."
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-blue-500"
        />
      </div>
      {loading && (
        <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">
          Loading analyses...
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-zinc-800">
        <table className="w-full">
          <thead className="bg-zinc-900">
            <tr>
              <th className="p-4 text-left">Error</th>
              <th className="p-4 text-left">Source</th>
              <th className="p-4 text-left">Created</th>
            </tr>
          </thead>

          <tbody>
  {history.length === 0 ? (
    <tr>
      <td
        colSpan={3}
        className="p-8 text-center text-zinc-500"
      >
        No analyses found.
      </td>
    </tr>
  ) : (
    history.map((item) => (
      <tr
        key={item.id}
        onClick={() => setSelected(item)}
        className="cursor-pointer border-t border-zinc-800 transition hover:bg-zinc-900"
      >
        <td className="p-4">
          {item.error_type}
        </td>

        <td className="p-4">
          {item.analysis_source}
        </td>

        <td className="p-4">
          {new Date(item.created_at + "Z").toLocaleString(
            undefined,
            {
              dateStyle: "medium",
              timeStyle: "short",
            }
          )}
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>
      </div>
      {selected && (
  <div className="mt-8 space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

    <div>
      <p className="text-xs uppercase tracking-widest text-zinc-500">
        Error Type
      </p>
      <h2 className="mt-1 text-2xl font-semibold">
        {selected.error_type}
      </h2>
    </div>

    <div>
      <p className="text-xs uppercase tracking-widest text-zinc-500">
        Root Cause
      </p>
      <p>{selected.root_cause}</p>
    </div>

    <div>
      <p className="text-xs uppercase tracking-widest text-zinc-500">
        Explanation
      </p>
      <p>{selected.explanation}</p>
    </div>

    <div>
      <p className="text-xs uppercase tracking-widest text-zinc-500">
        Fix Suggestion
      </p>
      <p>{selected.fix_suggestion}</p>
    </div>

    <div>
      <p className="text-xs uppercase tracking-widest text-zinc-500">
        Command
      </p>

      <pre className="mt-2 rounded-lg bg-black p-4 overflow-x-auto">
        <code>{selected.fix_command}</code>
      </pre>
    </div>
  </div>
)}
    </>
  );
}