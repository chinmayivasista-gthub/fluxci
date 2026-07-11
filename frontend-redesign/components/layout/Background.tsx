"use client";

import HexagonField from "./HexagonField";

export default function Background({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090f] text-white">

      {/* Animated Hexagon Layer */}

      <HexagonField />

      {/* Large Ambient Glow */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top,#2563eb22,transparent_55%)]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-40
          h-[500px]
          w-[500px]
          rounded-full
          bg-blue-600/5
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-0
          bottom-0
          h-[600px]
          w-[600px]
          rounded-full
          bg-cyan-500/5
          blur-[160px]
        "
      />

      {/* Content */}

           <div className="relative z-10 flex min-h-screen flex-col">

        {children}

      </div>

    </div>
  );
}