"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu } from "lucide-react";

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Investigate",
    href: "/investigate",
  },
  {
    name: "Analysis",
    href: "/analysis",
  },
  {
    name: "History",
    href: "/history",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="z-50 bg-transparent">

      {/* This wrapper creates vertical breathing room */}

      <div className="container pt-6 pb-8">

        <div
          className="
            flex
            h-[82px]
            items-center
            justify-between
            rounded-2xl
            border
            border-zinc-800/70
            bg-[#0b1220]/80
            px-8
            backdrop-blur-xl
            shadow-[0_20px_60px_rgba(0,0,0,.45)]
          "
        >

          {/* Logo */}

          <Link
            href="/"
            className="flex items-center gap-4"
          >

            <div className="relative h-14 w-14 shrink-0">

  <Image
    src="/logo-v2.png"
    alt="FluxCI Logo"
    fill
    className="object-contain"
    priority
  />

</div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight">
                FluxCI
              </h1>

             <p className="text-sm text-zinc-500">
                AI Pipeline Analyzer
              </p>

            </div>

          </Link>

          {/* Navigation */}

          <nav className="flex items-center gap-5">

            {links.map((link) => {

              const active =
                pathname === link.href;

              return (

                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    rounded-xl
                    px-6
                    py-3
                    text-base   
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

        </div>

      </div>

    </header>
  );
}