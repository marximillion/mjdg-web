// Copyright © MJMDG 2026
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  accent: "blue" | "gold" | "muted";
}

function getThemeColors(el: HTMLElement) {
  const style = getComputedStyle(el);
  return {
    blue:  style.getPropertyValue("--brand-blue").trim()  || "#1562C8",
    gold:  style.getPropertyValue("--brand-gold").trim()  || "#FFD100",
    muted: style.getPropertyValue("--text-subtle").trim() || "#55575B",
    edge:  style.getPropertyValue("--text-subtle").trim() || "#55575B",
  };
}

export default function NetworkScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0;
    let mouse = { x: -9999, y: -9999 };
    let rafId = 0;
    let particles: Particle[] = [];

    const CONNECT_DIST = 140;
    const DENSITY = 1 / 9000; // one particle per 9000px²

    function resize() {
      const el = canvas.parentElement!;
      W = canvas.width  = el.offsetWidth;
      H = canvas.height = el.offsetHeight;
    }

    function spawn(): Particle {
      const roll = Math.random();
      const accent: Particle["accent"] =
        roll < 0.08 ? "blue" : roll < 0.15 ? "gold" : "muted";
      return {
        x:       Math.random() * W,
        y:       Math.random() * H,
        vx:      (Math.random() - 0.5) * 0.35,
        vy:      (Math.random() - 0.5) * 0.35,
        size:    accent === "muted" ? 1.5 + Math.random() * 1.5 : 2.5 + Math.random(),
        opacity: accent === "muted" ? 0.2 + Math.random() * 0.25 : 0.55 + Math.random() * 0.3,
        accent,
      };
    }

    function init() {
      particles = Array.from({ length: Math.max(40, Math.min(200, Math.round(W * H * DENSITY))) }, spawn);
    }

    function draw() {
      const colors = getThemeColors(canvas);

      ctx.clearRect(0, 0, W, H);

      // mouse repulsion
      const MX = mouse.x, MY = mouse.y;

      for (const p of particles) {
        if (!reduced) {
          const dx = p.x - MX, dy = p.y - MY;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 120 && d > 0) {
            const force = (120 - d) / 120 * 0.6;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
          // speed cap
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > 1.4) { p.vx *= 1.4 / speed; p.vy *= 1.4 / speed; }

          p.x += p.vx;
          p.y += p.vy;

          // soft wrap
          if (p.x < -10) p.x = W + 10;
          if (p.x > W + 10) p.x = -10;
          if (p.y < -10) p.y = H + 10;
          if (p.y > H + 10) p.y = -10;
        }
      }

      // edges
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            const alpha = (1 - d / CONNECT_DIST) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = hexAlpha(colors.edge, alpha);
            ctx.lineWidth = 0.8;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const p of particles) {
        const color = p.accent === "blue" ? colors.blue
                    : p.accent === "gold" ? colors.gold
                    : colors.muted;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = hexAlpha(color, p.opacity);
        ctx.fill();
      }
    }

    function loop() {
      draw();
      if (!reduced) rafId = requestAnimationFrame(loop);
    }

    function hexAlpha(hex: string, alpha: number): string {
      const h = hex.replace("#", "");
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    }

    const ro = new ResizeObserver(() => { resize(); init(); if (reduced) draw(); });
    ro.observe(canvas.parentElement!);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    canvas.parentElement!.addEventListener("mousemove", onMouseMove);
    canvas.parentElement!.addEventListener("mouseleave", onMouseLeave);

    resize();
    init();
    loop();

    function countForArea() { return Math.round(W * H * DENSITY); }

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.parentElement?.removeEventListener("mousemove", onMouseMove);
      canvas.parentElement?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
