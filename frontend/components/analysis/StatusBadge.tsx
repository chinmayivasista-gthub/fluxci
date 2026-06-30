interface StatusBadgeProps {
  source: string;
}

export default function StatusBadge({
  source,
}: StatusBadgeProps) {
  const deterministic = source === "deterministic";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
        deterministic
          ? "bg-green-500/20 text-green-400 border border-green-500/30"
          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
      }`}
    >
      <span className="text-base">
        {deterministic ? "🟢" : "🤖"}
      </span>

      {deterministic
        ? "Deterministic Engine"
        : "Gemini AI"}
    </span>
  );
}