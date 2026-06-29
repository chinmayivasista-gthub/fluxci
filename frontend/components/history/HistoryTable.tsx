"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Analysis {
  id: number;
  job_id: string;
  error_type: string;
  analysis_source: string;
  created_at: string;
}

export default function HistoryTable() {
  const [history, setHistory] = useState<Analysis[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
  async function loadHistory() {
    const endpoint =
      search.trim() === ""
        ? "/history"
        : `/history/search?q=${encodeURIComponent(search)}`;

    const response = await api.get(endpoint);

    setHistory(response.data);
  }

  loadHistory();
}, [search]);


  <div className="mb-6">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search analyses..."
    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 outline-none focus:border-blue-500"
  />
</div>
  return (
    
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
          {history.map((item) => (
            <tr
              key={`${item.created_at}-${item.error_type}`}
              className="border-t border-zinc-800"
            >
              <td className="p-4">
                {item.error_type}
              </td>

              <td className="p-4">
                {item.analysis_source}
              </td>

              <td className="p-4">
                {
                    new Date(item.created_at + "Z").toLocaleString(
                        undefined,
                        {
                        dateStyle: "medium",
                        timeStyle: "short",
                        }
                    )
                    }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}