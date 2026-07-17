"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { name: "Home", href: "/" },
  { name: "Investigate", href: "/investigate" },
  { name: "Analysis", href: "/analysis" },
  { name: "History", href: "/history" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="mx-auto w-[94%] pt-6 pb-8">
        <div
          className="
            flex
            h-[76px]
            md:h-[82px]
            items-center
            justify-between
            rounded-2xl
            border
            border-zinc-800/70
            bg-[#0b1220]/80
            px-5
            md:px-8
            backdrop-blur-xl
            shadow-[0_20px_60px_rgba(0,0,0,.45)]
          "
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 md:gap-4">
            <div className="relative h-11 w-11 md:h-14 md:w-14 shrink-0">
              <Image
                src="/logo-v2.png"
                alt="FluxCI Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                FluxCI
              </h1>
              <p className="hidden sm:block text-sm text-zinc-500">
                AI Pipeline Analyzer
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative
                    rounded-xl
                    px-5
                    lg:px-6
                    py-3
                    text-[15px]
                    font-medium
                    transition-all
                    duration-200

                    ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }
                  `}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex md:hidden h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 transition hover:border-zinc-700 hover:text-white"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <nav className="mt-3 flex flex-col gap-1.5 rounded-2xl border border-zinc-800/70 bg-[#0b1220]/95 p-3 backdrop-blur-xl md:hidden animate-fade-in-up">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`
                    rounded-xl px-4 py-3 text-[15px] font-medium transition-all
                    ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }
                  `}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
