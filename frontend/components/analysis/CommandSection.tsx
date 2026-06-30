"use client";

import { useState } from "react";
import { Clipboard, Check } from "lucide-react";

interface CommandSectionProps {
  command: string;
}

export default function CommandSection({
  command,
}: CommandSectionProps) {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    await navigator.clipboard.writeText(command);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Command
        </h3>

        <button
          onClick={copyCommand}
          className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm transition hover:border-zinc-500 hover:bg-zinc-800"
        >
          {copied ? (
            <>
              <Check size={16} />
              Copied
            </>
          ) : (
            <>
              <Clipboard size={16} />
              Copy
            </>
          )}
        </button>
      </div>

      <pre className="overflow-x-auto rounded-xl bg-black/70 p-4 text-sm border border-zinc-800">
        <code>{command}</code>
      </pre>
    </div>
  );
}