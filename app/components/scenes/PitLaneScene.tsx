// Copyright © MJMDG 2026
import { useEffect, useRef } from "react";
import * as THREE from "three";

// ── Theme-aware palette ──────────────────────────────────────────────────────
// Reads the same CSS custom properties app.css defines for --brand-red/gold/blue
// etc. so the scene always matches whatever theme <html data-theme> is set to,
// instead of carrying its own hardcoded colors.

function readVar(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function hexToInt(hex: string): number {
  return parseInt(hex.replace("#", ""), 16);
}

interface ScenePalette {
  bg: number;
  fogNear: number;
  fogFar: number;
  floorLine: number;
  floorLane: number;
  skyline: number;
  cardAccents: number[];
  beamOpacity: number;
  particleOpacity: number;
}

function readPalette(): ScenePalette {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const red = hexToInt(readVar("--brand-red", "#CC1E26"));
  const gold = hexToInt(readVar("--brand-gold", "#FFD100"));
  const blue = hexToInt(readVar("--brand-blue", "#1562C8"));
  const muted = hexToInt(readVar("--text-muted", "#8A8C90"));
  const bg = hexToInt(readVar("--bg-main", isLight ? "#E8E4DC" : "#0E0F10"));

  return {
    bg,
    fogNear: isLight ? 30 : 40,
    fogFar: isLight ? 200 : 260,
    floorLine: blue,
    floorLane: gold,
    skyline: hexToInt(readVar("--bg-elevated", isLight ? "#D4CFC6" : "#252629")),
    cardAccents: [red, blue, muted, gold],
    beamOpacity: isLight ? 0.35 : 0.75,
    particleOpacity: isLight ? 0.35 : 0.55,
  };
}

// ── Scene builders ───────────────────────────────────────────────────────────

function buildFloorTexture(palette: ScenePalette): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = `#${palette.bg.toString(16).padStart(6, "0")}`;
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.strokeStyle = `#${palette.floorLine.toString(16).padStart(6, "0")}`;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1;
  const step = 1024 / 16;
  for (let i = 0; i <= 16; i++) {
    ctx.beginPath();
    ctx.moveTo(i * step, 0);
    ctx.lineTo(i * step, 1024);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * step);
    ctx.lineTo(1024, i * step);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.strokeStyle = `#${palette.floorLane.toString(16).padStart(6, "0")}`;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(1024 * 0.3, 0);
  ctx.lineTo(1024 * 0.3, 1024);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(1024 * 0.7, 0);
  ctx.lineTo(1024 * 0.7, 1024);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 26);
  return tex;
}

function buildParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255,255,255,0.9)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(canvas);
}

const CARD_Z = [-40, -110, -180, -250];

export default function PitLaneScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let palette = readPalette();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    } catch {
      return; // WebGL unavailable — CSS fallback in app.css covers this
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(palette.bg, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(palette.bg, palette.fogNear, palette.fogFar);

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
    camera.position.set(0, 3.4, 18);

    // Floor
    const floorTex = buildFloorTexture(palette);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 500),
      new THREE.MeshBasicMaterial({ map: floorTex })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -180);
    scene.add(floor);

    // Skyline
    const skyline = new THREE.Group();
    const skylineMat = new THREE.MeshBasicMaterial({ color: palette.skyline });
    for (let s = 0; s < 22; s++) {
      const w = 3 + Math.random() * 5;
      const h = 8 + Math.random() * 34;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), skylineMat);
      mesh.position.set((Math.random() - 0.5) * 130, h / 2, -260 - Math.random() * 40);
      skyline.add(mesh);
    }
    scene.add(skyline);

    // Light beams
    const beams = new THREE.Group();
    for (let b = 0; b < 10; b++) {
      const bh = 6 + Math.random() * 16;
      const color = palette.cardAccents[b % palette.cardAccents.length];
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: palette.beamOpacity,
      });
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, bh, 6), mat);
      beam.position.set((Math.random() - 0.5) * 44, bh / 2, -20 - Math.random() * 320);
      beam.userData.baseOpacity = palette.beamOpacity;
      beam.userData.phase = Math.random() * Math.PI * 2;
      beams.add(beam);
    }
    scene.add(beams);

    // Dust particles
    const PCOUNT = 220;
    const positions = new Float32Array(PCOUNT * 3);
    for (let p = 0; p < PCOUNT; p++) {
      positions[p * 3 + 0] = (Math.random() - 0.5) * 46;
      positions[p * 3 + 1] = Math.random() * 13;
      positions[p * 3 + 2] = -Math.random() * 360;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.22,
      map: buildParticleTexture(),
      color: palette.cardAccents[3],
      transparent: true,
      depthWrite: false,
      opacity: palette.particleOpacity,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // Project plaques
    const cardEdges: THREE.LineSegments[] = [];
    const cardGroup = new THREE.Group();
    for (let c = 0; c < 4; c++) {
      const accent = palette.cardAccents[c];
      const x = c % 2 === 0 ? -9 : 9;
      const boxGeo = new THREE.BoxGeometry(3.2, 4.4, 0.3);

      const screenCanvas = document.createElement("canvas");
      screenCanvas.width = 256;
      screenCanvas.height = 352;
      const sctx = screenCanvas.getContext("2d")!;
      sctx.fillStyle = `#${palette.skyline.toString(16).padStart(6, "0")}`;
      sctx.fillRect(0, 0, 256, 352);
      const glow = sctx.createRadialGradient(128, 150, 10, 128, 150, 170);
      glow.addColorStop(0, `#${accent.toString(16).padStart(6, "0")}`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      sctx.globalAlpha = 0.5;
      sctx.fillStyle = glow;
      sctx.fillRect(0, 0, 256, 352);
      const faceTex = new THREE.CanvasTexture(screenCanvas);

      const sideMat = new THREE.MeshBasicMaterial({ color: palette.skyline });
      const box = new THREE.Mesh(boxGeo, [
        sideMat,
        sideMat,
        sideMat,
        sideMat,
        new THREE.MeshBasicMaterial({ map: faceTex }),
        sideMat,
      ]);
      box.position.set(x, 2.2, CARD_Z[c]);
      cardGroup.add(box);

      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(boxGeo),
        new THREE.LineBasicMaterial({ color: accent })
      );
      edges.position.copy(box.position);
      cardGroup.add(edges);
      cardEdges.push(edges);
    }
    scene.add(cardGroup);

    // ── Scroll-driven camera ──
    const laneEl = document.querySelector<HTMLElement>("[data-pitlane-track]");
    let scrollProgress = 0;
    function updateProgress() {
      if (!laneEl) return;
      const rect = laneEl.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      scrollProgress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    }
    // Capture phase: this app's layout scrolls `body`, not `window`, and
    // scroll events don't bubble — capture:true still catches them on the
    // way down regardless of which ancestor is the actual scrolling box.
    window.addEventListener("scroll", updateProgress, { passive: true, capture: true });
    updateProgress();

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onResize);

    // ── Live theme switching ──
    function applyPalette() {
      palette = readPalette();
      renderer.setClearColor(palette.bg, 1);
      if (scene.fog instanceof THREE.Fog) {
        scene.fog.color.set(palette.bg);
        scene.fog.near = palette.fogNear;
        scene.fog.far = palette.fogFar;
      }
      floorTex.dispose();
      (floor.material as THREE.MeshBasicMaterial).map = buildFloorTexture(palette);
      (floor.material as THREE.MeshBasicMaterial).needsUpdate = true;
      skylineMat.color.set(palette.skyline);
      beams.children.forEach((beam, i) => {
        const mat = (beam as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.color.set(palette.cardAccents[i % palette.cardAccents.length]);
        mat.opacity = palette.beamOpacity;
        beam.userData.baseOpacity = palette.beamOpacity;
      });
      pMat.opacity = palette.particleOpacity;
      cardEdges.forEach((edge, i) => {
        (edge.material as THREE.LineBasicMaterial).color.set(palette.cardAccents[i]);
      });
    }
    const themeObserver = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.attributeName === "data-theme")) applyPalette();
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    let currentZ = camera.position.z;
    const clock = new THREE.Clock();
    let rafId = 0;

    function render() {
      const targetZ = THREE.MathUtils.lerp(18, -300, scrollProgress);
      camera.position.z = targetZ;
      camera.lookAt(0, 2.4, targetZ - 30);
      renderer.render(scene, camera);
    }

    function tick() {
      const targetZ = THREE.MathUtils.lerp(18, -300, scrollProgress);
      currentZ += (targetZ - currentZ) * 0.08;
      camera.position.z = currentZ;
      camera.lookAt(0, 2.4, currentZ - 30);

      const t = clock.getElapsedTime();
      beams.children.forEach((beam) => {
        const mat = (beam as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = beam.userData.baseOpacity * (0.7 + 0.3 * Math.sin(t * 1.2 + beam.userData.phase));
      });
      const posAttr = pGeo.attributes.position as THREE.BufferAttribute;
      for (let p = 0; p < PCOUNT; p++) {
        let y = posAttr.getY(p) + 0.01;
        if (y > 13) y = 0;
        posAttr.setY(p, y);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    }

    if (reducedMotion) {
      render();
      window.addEventListener("scroll", render, { passive: true, capture: true });
      window.addEventListener("resize", render);
    } else {
      tick();
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateProgress, { capture: true });
      window.removeEventListener("scroll", render, { capture: true });
      window.removeEventListener("resize", onResize);
      window.removeEventListener("resize", render);
      themeObserver.disconnect();
      pGeo.dispose();
      floorTex.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="pitlane-canvas" aria-hidden="true" />;
}
