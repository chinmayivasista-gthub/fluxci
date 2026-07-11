"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, History } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Investigate",
    href: "/",
    icon: Activity,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-8">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-card">
            <Activity className="h-5 w-5" />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-base font-semibold tracking-tight">
              FluxCI
            </span>
            <span className="text-xs text-muted-foreground">
              CI Failure Investigation
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}