"use client";

import { useEffect, useRef } from "react";

type Props = {
  svgSrc?: string;
  count?: number;
  minSize?: number;
  maxSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
  baseOpacity?: number;
  zIndex?: number | string;
  tintLight?: string;
  tintDark?: string;
};

type Sprite = {
  x: number;
  y: number;
  size: number;
  speed: number;
  dir: 1 | -1;
  opacity: number;
};

export default function HouseBackground({
  svgSrc = "/assets/HouseBackground.svg",
  count = 25,
  minSize = 10,
  maxSize = 160,
  minSpeed = 6,
  maxSpeed = 60,
  baseOpacity = 0.08,
  zIndex = 0,
  tintLight = "rgba(0,0,0,0.5)",
  tintDark = "rgba(255,255,255,0.5)",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const tint = isDark ? tintDark : tintLight;

    let w = 0;
    let h = 0;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const img = new Image();
    img.src = svgSrc;

    let sprites: Sprite[] = [];
    let running = true;
    let last = performance.now();

    const rnd = (a: number, b: number) => Math.random() * (b - a) + a;

    const resize = (
      c: HTMLCanvasElement,
      context: CanvasRenderingContext2D
    ) => {
      w = window.innerWidth;
      h = window.innerHeight;
      c.style.width = w + "px";
      c.style.height = h + "px";
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnSprite = (fromEdge?: "left" | "right"): Sprite => {
      const size = rnd(minSize, maxSize);
      const edge = fromEdge ?? (Math.random() < 0.5 ? "left" : "right");
      const dir: 1 | -1 = edge === "left" ? 1 : -1;
      const sizeInfluence = size / maxSize;
      const speed =
        rnd(minSpeed, maxSpeed) * (0.3 + Math.random() + sizeInfluence);
      const y = rnd(0, h);
      const x =
        edge === "left"
          ? -size - rnd(0, w * 0.25)
          : w + size + rnd(0, w * 0.25);
      const opacityJitter = 0.6 + Math.random() * 0.8;
      const sizeFade = Math.max(0.5, 1 - size / (maxSize * 1.2));
      return {
        x,
        y,
        size,
        speed,
        dir,
        opacity: baseOpacity * opacityJitter * sizeFade,
      };
    };

    const seed = () => {
      sprites = Array.from({ length: count }, () =>
        spawnSprite(Math.random() < 0.5 ? "left" : "right")
      );
      if (prefersReduced) sprites.forEach((s) => (s.x = rnd(0, w)));
    };

    const clear = (context: CanvasRenderingContext2D) => {
      context.clearRect(0, 0, w, h);
    };

    const drawSprite = (context: CanvasRenderingContext2D, s: Sprite) => {
      if (!img.complete) return;
      context.globalAlpha = s.opacity;
      context.drawImage(img, s.x, s.y, s.size, s.size);
      context.globalAlpha = 1;
    };

    const tintPass = (context: CanvasRenderingContext2D) => {
      context.save();
      context.globalCompositeOperation = "source-atop";
      context.fillStyle = tint;
      context.fillRect(0, 0, w, h);
      context.restore();
    };

    const step = (ts: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;

      clear(ctx);

      for (let i = 0; i < sprites.length; i++) {
        const s = sprites[i];
        drawSprite(ctx, s);
        if (!prefersReduced) {
          s.x += s.dir * s.speed * dt;
          if (s.dir === 1 && s.x - s.size > w) sprites[i] = spawnSprite("left");
          if (s.dir === -1 && s.x + s.size < 0)
            sprites[i] = spawnSprite("right");
        }
      }

      tintPass(ctx);
      rafRef.current = requestAnimationFrame(step);
    };

    const onVisibility = () => {
      if (document.hidden && rafRef.current) {
        running = false;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!document.hidden && !rafRef.current) {
        running = true;
        last = performance.now();
        rafRef.current = requestAnimationFrame(step);
      }
    };

    resize(canvas, ctx);
    seed();
    window.addEventListener("resize", () => resize(canvas, ctx));
    document.addEventListener("visibilitychange", onVisibility);

    img.decode?.().finally(() => {
      last = performance.now();
      rafRef.current = requestAnimationFrame(step);
    });

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", () => resize(canvas, ctx));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [
    svgSrc,
    count,
    minSize,
    maxSize,
    minSpeed,
    maxSpeed,
    baseOpacity,
    tintLight,
    tintDark,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        pointerEvents: "none",
      }}
    />
  );
}
