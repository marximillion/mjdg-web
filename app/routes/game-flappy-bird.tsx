// Copyright © MJMDG 2026
import { useEffect, useRef, useState, useCallback } from "react";
import { redirect } from "react-router";
import type { Route } from "./+types/game-flappy-bird";
import PageLayout from "~/components/PageLayout";
import { getUserFromSession } from "~/db/session.server";
import birdImg from "../assets/images/peeps/mdg-bald-icon.jpg";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Flappy Bird | MJMDG" },
    { name: "description", content: "Flappy Bird" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  if (!userId) return redirect("/");
  return { isAuthenticated: true };
}

// --- Constants ---
const W = 480;
const H = 640;
const BIRD_X = 100;
const BIRD_R = 16;
const GRAVITY = 0.38;
const JUMP = -7.5;
const PIPE_W = 58;
const PIPE_GAP = 155;
const PIPE_SPEED = 2.8;
const PIPE_INTERVAL = 1600; // ms

interface Pipe {
  x: number;
  topH: number;
  scored: boolean;
}

type Status = "idle" | "playing" | "dead";

function getThemeColors() {
  const isDark = document.documentElement.getAttribute("data-theme") !== "light";
  return {
    bg: isDark ? "#0E0F10" : "#E8E4DC",
    panel: isDark ? "#1C1D20" : "#DEDAD2",
    bird: "#C23B2E",
    pipe: "#3D5EA8",
    pipeEdge: "#2E4A8A",
    text: isDark ? "#F4F3F1" : "#18191A",
    muted: isDark ? "#8A8C90" : "#4A4C50",
    subtle: isDark ? "#55575B" : "#8A8C90",
    ground: isDark ? "#252629" : "#D4CFC6",
  };
}

export default function FlappyBird({ loaderData }: Route.ComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    birdY: H / 2,
    birdV: 0,
    pipes: [] as Pipe[],
    score: 0,
    status: "idle" as Status,
    lastPipe: 0,
    frame: 0,
    birdAngle: 0,
  });
  const rafRef = useRef<number>(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayStatus, setDisplayStatus] = useState<Status>("idle");
  const [highScore, setHighScore] = useState(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem("flappy-highscore") ?? "0", 10);
  });

  const flap = useCallback(() => {
    const s = stateRef.current;
    if (s.status === "idle") {
      s.status = "playing";
      s.birdV = JUMP;
      setDisplayStatus("playing");
    } else if (s.status === "playing") {
      s.birdV = JUMP;
    } else if (s.status === "dead") {
      // reset
      s.birdY = H / 2;
      s.birdV = 0;
      s.pipes = [];
      s.score = 0;
      s.lastPipe = 0;
      s.frame = 0;
      s.birdAngle = 0;
      s.status = "idle";
      setDisplayScore(0);
      setDisplayStatus("idle");
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const bird = new Image();
    bird.src = birdImg;

    let lastTime = 0;

    function draw(ts: number) {
      const dt = Math.min(ts - lastTime, 50);
      lastTime = ts;
      const s = stateRef.current;
      const c = getThemeColors();

      // --- Physics ---
      if (s.status === "playing") {
        s.frame++;
        s.birdV += GRAVITY;
        s.birdY += s.birdV;
        s.birdAngle = Math.min(Math.max(s.birdV * 3.5, -25), 85);

        // Spawn pipes
        if (ts - s.lastPipe > PIPE_INTERVAL || s.lastPipe === 0) {
          const minTop = 60;
          const maxTop = H - PIPE_GAP - 100;
          const topH = Math.random() * (maxTop - minTop) + minTop;
          s.pipes.push({ x: W + PIPE_W, topH, scored: false });
          s.lastPipe = ts;
        }

        // Move pipes
        for (const p of s.pipes) p.x -= PIPE_SPEED;
        s.pipes = s.pipes.filter((p) => p.x + PIPE_W > -10);

        // Score
        for (const p of s.pipes) {
          if (!p.scored && p.x + PIPE_W < BIRD_X) {
            p.scored = true;
            s.score++;
            setDisplayScore(s.score);
          }
        }

        // Collision — ground / ceiling
        if (s.birdY + BIRD_R >= H - 30 || s.birdY - BIRD_R <= 0) {
          die();
        }

        // Collision — pipes
        for (const p of s.pipes) {
          const bLeft = BIRD_X - BIRD_R + 4;
          const bRight = BIRD_X + BIRD_R - 4;
          const bTop = s.birdY - BIRD_R + 4;
          const bBottom = s.birdY + BIRD_R - 4;
          const inX = bRight > p.x && bLeft < p.x + PIPE_W;
          const inTop = bTop < p.topH;
          const inBot = bBottom > p.topH + PIPE_GAP;
          if (inX && (inTop || inBot)) { die(); break; }
        }
      }

      // --- Draw ---
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = c.bg;
      ctx.fillRect(0, 0, W, H);

      // Pipes
      for (const p of s.pipes) {
        // Top pipe
        ctx.fillStyle = c.pipe;
        ctx.beginPath();
        ctx.roundRect(p.x, 0, PIPE_W, p.topH - 10, [0, 0, 6, 6]);
        ctx.fill();
        // Top cap
        ctx.fillStyle = c.pipeEdge;
        ctx.beginPath();
        ctx.roundRect(p.x - 4, p.topH - 20, PIPE_W + 8, 20, [0, 0, 6, 6]);
        ctx.fill();
        // Bottom pipe
        ctx.fillStyle = c.pipe;
        ctx.beginPath();
        ctx.roundRect(p.x, p.topH + PIPE_GAP + 10, PIPE_W, H - (p.topH + PIPE_GAP + 10) - 30, [6, 6, 0, 0]);
        ctx.fill();
        // Bottom cap
        ctx.fillStyle = c.pipeEdge;
        ctx.beginPath();
        ctx.roundRect(p.x - 4, p.topH + PIPE_GAP, PIPE_W + 8, 20, [6, 6, 0, 0]);
        ctx.fill();
      }

      // Ground
      ctx.fillStyle = c.ground;
      ctx.fillRect(0, H - 30, W, 30);
      // Ground line
      ctx.fillStyle = c.subtle;
      ctx.fillRect(0, H - 30, W, 1);

      // Bird
      const size = BIRD_R * 2.5;
      ctx.save();
      ctx.translate(BIRD_X, s.birdY);
      ctx.rotate((s.birdAngle * Math.PI) / 180);
      // Clip to circle
      ctx.beginPath();
      ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(bird, -BIRD_R, -BIRD_R, size, size);
      ctx.restore();

      // --- UI overlays ---
      ctx.font = "600 14px 'Archivo', sans-serif";
      ctx.fillStyle = c.muted;

      if (s.status === "idle") {
        ctx.textAlign = "center";
        ctx.font = "600 22px 'Archivo', sans-serif";
        ctx.fillStyle = c.text;
        ctx.fillText("Flappy Bird", W / 2, H / 2 - 40);
        ctx.font = "500 14px 'Archivo', sans-serif";
        ctx.fillStyle = c.muted;
        ctx.fillText("Click, tap, or press Space to start", W / 2, H / 2);
        if (highScore > 0) {
          ctx.font = "500 13px 'JetBrains Mono', monospace";
          ctx.fillStyle = c.subtle;
          ctx.fillText(`Best: ${highScore}`, W / 2, H / 2 + 28);
        }
      }

      if (s.status === "dead") {
        ctx.textAlign = "center";
        ctx.font = "600 22px 'Archivo', sans-serif";
        ctx.fillStyle = c.text;
        ctx.fillText("Game Over", W / 2, H / 2 - 50);
        ctx.font = "500 15px 'Archivo', sans-serif";
        ctx.fillStyle = c.muted;
        ctx.fillText(`Score: ${s.score}`, W / 2, H / 2 - 18);
        ctx.font = "500 13px 'JetBrains Mono', monospace";
        ctx.fillStyle = c.subtle;
        ctx.fillText(`Best: ${parseInt(localStorage.getItem("flappy-highscore") ?? "0", 10)}`, W / 2, H / 2 + 10);
        ctx.font = "500 13px 'Archivo', sans-serif";
        ctx.fillStyle = c.muted;
        ctx.fillText("Click, tap, or press Space to retry", W / 2, H / 2 + 40);
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function die() {
      const s = stateRef.current;
      s.status = "dead";
      setDisplayStatus("dead");
      const prev = parseInt(localStorage.getItem("flappy-highscore") ?? "0", 10);
      if (s.score > prev) {
        localStorage.setItem("flappy-highscore", String(s.score));
        setHighScore(s.score);
      }
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [highScore]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space") { e.preventDefault(); flap(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap]);

  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <div className="game-wrapper">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="game-canvas"
          onClick={flap}
        />
      </div>
    </PageLayout>
  );
}
