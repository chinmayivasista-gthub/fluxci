"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import StatusBadge from "@/components/analysis/StatusBadge";

import {
  Search,
  Calendar,
  Clipboard,
  Check,
  Terminal,
  Clock3,
  ChevronRight,
  FileWarning,
  Sparkles,
} from "lucide-react";

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

/* -------------------------------------------------------------------------- */
/*                               Helper Functions                             */
/* -------------------------------------------------------------------------- */

function formatDate(date: string) {
  return new Date(date + "Z").toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function relativeTime(date: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(date + "Z").getTime()) / 1000
  );

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60)
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24)
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);

  if (days < 7)
    return `${days} day${days !== 1 ? "s" : ""} ago`;

  return formatDate(date);
}

/* -------------------------------------------------------------------------- */
/*                             Loading Skeleton                               */
/* -------------------------------------------------------------------------- */

function LoadingSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border bg-background p-5"
        >
          <div className="mb-4 h-5 w-2/3 rounded bg-muted" />

          <div className="mb-5 h-4 w-full rounded bg-muted" />

          <div className="flex items-center justify-between">
            <div className="h-7 w-28 rounded-full bg-muted" />

            <div className="h-4 w-20 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Empty State                                  */
/* -------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="mb-5 rounded-full border bg-muted/30 p-5">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>

      <h3 className="text-xl font-semibold">
        No investigations found
      </h3>

      <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
        Try changing your search query or run another pipeline
        analysis to generate new investigation history.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              History Card                                  */
/* -------------------------------------------------------------------------- */

interface HistoryCardProps {
  item: Analysis;
  active: boolean;
  onClick: () => void;
}

function HistoryCard({
  item,
  active,
  onClick,
}: HistoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
        active
          ? "border-primary/40 bg-primary/5 shadow-md"
          : "hover:-translate-y-0.5 hover:border-primary/20 hover:bg-muted/40"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold">
            {item.error_type}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {item.root_cause}
          </p>
        </div>

        <ChevronRight
          className={`mt-1 h-5 w-5 shrink-0 transition-transform ${
            active
              ? "translate-x-1 text-primary"
              : "text-muted-foreground group-hover:translate-x-1"
          }`}
        />
      </div>

      <div className="mb-4">
        <StatusBadge source={item.analysis_source} />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <Clock3 className="h-3.5 w-3.5" />
          {relativeTime(item.created_at)}
        </span>

        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(item.created_at)}
        </span>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Metadata Card                                 */
/* -------------------------------------------------------------------------- */

interface MetadataCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
}

function MetadataCard({
  title,
  value,
  subtitle,
}: MetadataCardProps) {
  return (
    <div className="rounded-2xl border bg-background p-5 transition hover:border-primary/20">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </p>

      <div className="break-words font-medium">
        {value}
      </div>

      {subtitle && (
        <div className="mt-2 text-sm text-muted-foreground">
          {subtitle}
        </div>
      )}
    </div>
  );
}
export default function HistoryTable() {
  const [history, setHistory] = useState<Analysis[]>([]);
  const [selected, setSelected] = useState<Analysis | null>(null);

  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                               Debounced Search                             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  /* -------------------------------------------------------------------------- */
  /*                               Load History                                 */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    let ignore = false;

    async function loadHistory() {
      setLoading(true);

      try {
        const endpoint =
          debouncedSearch.trim() === ""
            ? "/history"
            : `/history/search?q=${encodeURIComponent(
                debouncedSearch
              )}`;

        const { data } = await api.get(endpoint);

        if (ignore) return;

        setHistory(data);

        if (data.length === 0) {
          setSelected(null);
          return;
        }

        setSelected((previous) => {
          if (!previous) return data[0];

          const existing = data.find(
            (analysis: Analysis) =>
              analysis.id === previous.id
          );

          return existing ?? data[0];
        });
      } catch (error) {
        console.error(
          "Failed to load investigation history:",
          error
        );
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      ignore = true;
    };
  }, [debouncedSearch]);

  /* -------------------------------------------------------------------------- */
  /*                             Copy Command                                   */
  /* -------------------------------------------------------------------------- */

  async function handleCopyCommand() {
    if (!selected) return;

    try {
      await navigator.clipboard.writeText(
        selected.fix_command
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Clipboard error", error);
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                Derived Data                                */
  /* -------------------------------------------------------------------------- */

  const rows = useMemo(() => history, [history]);

  const totalInvestigations = rows.length;

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">

  {/* ====================================================================== */}
  {/* LEFT PANEL */}
  {/* ====================================================================== */}

  <section className="surface flex h-[780px] flex-col overflow-hidden">

    {/* ------------------------------------------------------------- */}
    {/* Header */}
    {/* ------------------------------------------------------------- */}

    <div className="workspace-header border-b">

      <div className="mb-5 flex items-start justify-between">

        <div>

          <p className="muted-label">
            Investigation History
          </p>

          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            Previous Analyses
          </h2>

        </div>

        <div className="rounded-xl border bg-background px-4 py-3 text-center">

          <div className="text-xl font-bold">
            {totalInvestigations}
          </div>

          <div className="text-xs text-muted-foreground">
            Results
          </div>

        </div>

      </div>

      <div className="relative">

        <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground"/>

        <input
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Search investigations..."
          className="w-full rounded-xl border bg-background py-3 pl-11 pr-4 text-sm transition-all outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
        />

      </div>

    </div>

    {/* ------------------------------------------------------------- */}
    {/* Investigation List */}
    {/* ------------------------------------------------------------- */}

    <div className="flex-1 overflow-y-auto">

      {loading ? (

        <LoadingSkeleton/>

      ) : rows.length===0 ? (

        <EmptyState/>

      ) : (

        <div className="space-y-3 p-4">

          {rows.map((item)=>{

            const active=selected?.id===item.id;

            return(

              <HistoryCard

                key={item.id}

                item={item}

                active={active}

                onClick={()=>setSelected(item)}

              />

            );

          })}

        </div>

      )}

    </div>

  </section>
      {/* ====================================================================== */}
    {/* RIGHT PANEL */}
    {/* ====================================================================== */}

    <section className="surface flex h-[780px] flex-col overflow-hidden">

      {!selected ? (

        <div className="flex h-full flex-col items-center justify-center px-8 text-center">

          <div className="mb-6 rounded-full border bg-muted/30 p-6">

            <FileWarning className="h-10 w-10 text-primary"/>

          </div>

          <h2 className="text-2xl font-semibold">
            Select an Investigation
          </h2>

          <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
            Choose an investigation from the left to inspect
            the detected failure, understand its cause and
            review the recommended fix.
          </p>

        </div>

      ) : (

        <>

          {/* =========================================================== */}
          {/* Header */}
          {/* =========================================================== */}

          <div className="workspace-header border-b">

            <div className="flex flex-wrap items-start justify-between gap-6">

              <div className="min-w-0">

                <p className="muted-label">
                  Investigation Details
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                  {selected.error_type}
                </h1>

                <div className="mt-5 flex flex-wrap gap-3">

                  <StatusBadge
                    source={selected.analysis_source}
                  />

                </div>

              </div>

              <button
                onClick={handleCopyCommand}
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition hover:bg-muted"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4"/>
                    Copied
                  </>
                ) : (
                  <>
                    <Clipboard className="h-4 w-4"/>
                    Copy Command
                  </>
                )}
              </button>

            </div>

          </div>

          {/* =========================================================== */}
          {/* Content */}
          {/* =========================================================== */}

          <div className="workspace-content flex-1 space-y-6 overflow-y-auto">

            <div className="rounded-2xl border bg-background p-6">

              <h3 className="mb-3 text-lg font-semibold">
                Root Cause
              </h3>

              <p className="leading-7 text-muted-foreground whitespace-pre-wrap">
                {selected.root_cause}
              </p>

            </div>

            <div className="rounded-2xl border bg-background p-6">

              <h3 className="mb-3 text-lg font-semibold">
                Explanation
              </h3>

              <p className="leading-7 text-muted-foreground whitespace-pre-wrap">
                {selected.explanation}
              </p>

            </div>

            <div className="rounded-2xl border bg-background p-6">

              <h3 className="mb-3 text-lg font-semibold">
                Suggested Fix
              </h3>

              <p className="leading-7 text-muted-foreground whitespace-pre-wrap">
                {selected.fix_suggestion}
              </p>

            </div>

            <div className="overflow-hidden rounded-2xl border">

              <div className="flex items-center justify-between border-b bg-muted/30 px-5 py-4">

                <div className="flex items-center gap-3">

                  <Terminal className="h-5 w-5"/>

                  <div>

                    <p className="font-semibold">
                      Terminal Command
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Copy and execute this command
                    </p>

                  </div>

                </div>

                <button
                  onClick={handleCopyCommand}
                  className="rounded-lg border px-3 py-2 text-sm transition hover:bg-background"
                >
                  {copied ? "Copied" : "Copy"}
                </button>

              </div>

              <pre className="overflow-x-auto bg-[#0d1117] p-6 text-sm text-green-400">

                <code>
                  {selected.fix_command}
                </code>

              </pre>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <MetadataCard
                title="Created"
                value={formatDate(selected.created_at)}
                subtitle={relativeTime(selected.created_at)}
              />

              <MetadataCard
                title="Job ID"
                value={
                  <span className="font-mono text-sm break-all">
                    {selected.job_id}
                  </span>
                }
              />

            </div>

          </div>

        </>
      )}

    </section>
      </div>
);
}