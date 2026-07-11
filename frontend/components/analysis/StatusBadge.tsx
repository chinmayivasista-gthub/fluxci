import { Bot, CheckCircle2 } from "lucide-react";

interface StatusBadgeProps {
  source: string;
}

export default function StatusBadge({
  source,
}: StatusBadgeProps) {
  const deterministic = source === "deterministic";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        deterministic
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-blue-500/30 bg-blue-500/10 text-blue-400"
      }`}
    >
      {deterministic ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <Bot className="h-3.5 w-3.5" />
      )}

      <span>
        {deterministic ? "Deterministic Engine" : "Gemini AI"}
      </span>
    </span>
  );
}