"use client";

import { useEffect, useRef } from "react";

type Hex = {
  x: number;
  y: number;
  ox: number;
  oy: number;
};

const SIZE = 22;
const GAP = 6;
const RADIUS = 140;

export default function HexagonField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Non-null aliases
    const canvasEl = canvas;
    const context = ctx;

    let width = 0;
    let height = 0;
    let anim = 0;

    const mouse = {
      x: -9999,
      y: -9999,
    };

    let hexes: Hex[] = [];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;

      canvasEl.width = width * dpr;
      canvasEl.height = height * dpr;

      canvasEl.style.width = `${width}px`;
      canvasEl.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      hexes = [];

      const h = Math.sqrt(3) * SIZE;
      const dx = SIZE * 1.5 + GAP;
      const dy = h + GAP;

      for (let c = -2; c < width / dx + 3; c++) {
        for (let r = -2; r < height / dy + 3; r++) {
          const x = c * dx;
          const y = r * dy + (c % 2 ? dy / 2 : 0);

          hexes.push({
            x,
            y,
            ox: x,
            oy: y,
          });
        }
      }
    }

    function draw(x: number, y: number) {
      context.beginPath();

      for (let i = 0; i < 6; i++) {
        const angle = ((60 * i - 30) * Math.PI) / 180;

        const px = x + SIZE * Math.cos(angle);
        const py = y + SIZE * Math.sin(angle);

        if (i === 0) {
          context.moveTo(px, py);
        } else {
          context.lineTo(px, py);
        }
      }

      context.closePath();
      context.strokeStyle = "rgba(59,130,246,0.12)";
      context.lineWidth = 1;
      context.stroke();
    }

    function loop() {
      context.clearRect(0, 0, width, height);

      for (const hex of hexes) {
        const dx = mouse.x - hex.x;
        const dy = mouse.y - hex.y;

        const dist = Math.hypot(dx, dy);

        let tx = hex.ox;
        let ty = hex.oy;

        if (dist < RADIUS && dist > 0.001) {
          const force = (1 - dist / RADIUS) * 18;

          tx -= (dx / dist) * force;
          ty -= (dy / dist) * force;
        }

        hex.x += (tx - hex.x) * 0.08;
        hex.y += (ty - hex.y) * 0.08;

        draw(hex.x, hex.y);
      }

      anim = requestAnimationFrame(loop);
    }

    function move(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    function leave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    loop();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);

    return () => {
      cancelAnimationFrame(anim);

      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 opacity-70"
    />
  );
}