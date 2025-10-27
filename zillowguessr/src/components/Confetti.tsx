"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  active: boolean;
  duration?: number; // ms
};

// Subtle confetti rain from the top. Small particle count, pastel colors,
// low opacity and short duration for a non-flashy effect.
export default function Confetti({ active, duration = 3000 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const colors = ["#FFC857", "#8BD3DD", "#FF9AA2", "#C9B6E1", "#BDECB6"];

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rot: number;
      rotV: number;
      opacity: number;
    };

    const particleCount = 26; // small and subtle
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: -Math.random() * 80, // start slightly above
        vx: (Math.random() - 0.5) * 0.6, // gentle horizontal drift
        vy: 1 + Math.random() * 1.4, // gentle fall speed
        size: 6 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.1,
        opacity: 0.6 + Math.random() * 0.3,
      });
    }

    const start = performance.now();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const t = (performance.now() - start) / duration;

      // fade out toward the end
      const globalAlpha = 1 - Math.min(Math.max((t - 0.6) / 0.4, 0), 1);
      ctx.save();
      ctx.globalAlpha = globalAlpha;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;

        // recycle if below the canvas
        if (p.y > height + 30) {
          p.y = -10 - Math.random() * 40;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * globalAlpha * 0.95;
        // draw rectangle confetti (subtle)
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => {
      width = window.innerWidth;
      canvas.width = Math.round(width * dpr);
      canvas.style.width = `${width}px`;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [active, duration]);

  // Only render canvas when active to keep DOM small
  if (!active) return null;

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
