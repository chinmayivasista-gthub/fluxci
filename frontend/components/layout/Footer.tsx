"use client";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="page-container flex flex-col gap-4 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">FluxCI</span>
          <span>•</span>
          <span>AI-powered CI Failure Investigation</span>
        </div>

        <div className="flex items-center gap-6">
          <span>Developer Workspace</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}