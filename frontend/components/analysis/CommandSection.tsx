"use client";

import { useState } from "react";
import {
  Clipboard,
  Check,
  Terminal,
} from "lucide-react";

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
    <section className="surface overflow-hidden">
      <div className="workspace-header">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />

          <div>
            <p className="muted-label">Command</p>
            <h3 className="text-sm font-semibold">
              Recommended Fix
            </h3>
          </div>
        </div>

        <button
          onClick={copyCommand}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-500" />
              Copied
            </>
          ) : (
            <>
              <Clipboard className="h-4 w-4" />
              Copy
            </>
          )}
        </button>
      </div>

      <div className="workspace-content">
        <pre className="overflow-x-auto rounded-xl border bg-black/80 p-4">
          <code className="mono text-sm">
            {command}
          </code>
        </pre>
      </div>
    </section>
  );
}