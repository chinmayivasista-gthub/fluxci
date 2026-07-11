"use client";

import {
  Bot,
  ShieldCheck,
} from "lucide-react";

interface StatusBadgeProps {
  source: string;
}

export default function StatusBadge({
  source,
}: StatusBadgeProps) {
  const gemini =
    source?.toLowerCase() === "gemini";

  return (
    <div
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        px-4
        py-2
        text-sm
        font-medium
        transition-all

        ${
          gemini
            ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
            : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
        }
      `}
    >
      {gemini ? (
        <Bot size={16} />
      ) : (
        <ShieldCheck size={16} />
      )}

      <span>
        {gemini
          ? "Gemini AI"
          : "Deterministic Rule"}
      </span>
    </div>
  );
}