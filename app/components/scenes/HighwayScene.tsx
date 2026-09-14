// Copyright © MJMDG 2026
import { useEffect, useRef } from "react";
import * as THREE from "three";

function readVar(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function hexToInt(hex: string): number {
  return parseInt(hex.replace("#", ""), 16);
}

function isLight(): boolean {
  return document.documentElement.getAttribute("data-theme") === "light";
}

// ── Highway Scene ─────────────────────────────────────────────────────────────
// Night highway stretching to a horizon glow. Scene is static until the user
// scrolls — dash lines and camera advance proportionally to scroll position.

export default function HighwayScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || typeof window === "undefined") return;

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // ── Scene / Camera ───────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1200
    );
    camera.position.set(0, 1.8, 0);
    camera.lookAt(0, 1.2, -60);

    // ── Palette ──────────────────────────────────────────────────────────────
    const light = isLight();
    const bgHex = readVar("--bg-main", light ? "#E8E4DC" : "#0E0F10");
    const bgInt = hexToInt(bgHex);

    scene.background = new THREE.Color(bgInt);
    scene.fog = new THREE.Fog(bgInt, light ? 60 : 80, light ? 280 : 400);

    // ── Road surface ─────────────────────────────────────────────────────────
    const roadCanvas = document.createElement("canvas");
    roadCanvas.width = 512;
    roadCanvas.height = 512;
    const rctx = roadCanvas.getContext("2d")!;
    rctx.fillStyle = light ? "#C8C4BA" : "#18191C";
    rctx.fillRect(0, 0, 512, 512);
    rctx.strokeStyle = light ? "#A8A49A" : "#2A2C30";
    rctx.lineWidth = 3;
    rctx.globalAlpha = 0.6;
    rctx.beginPath(); rctx.moveTo(60, 0);  rctx.lineTo(60, 512);  rctx.stroke();
    rctx.beginPath(); rctx.moveTo(452, 0); rctx.lineTo(452, 512); rctx.stroke();
    rctx.globalAlpha = 1;
    const roadTex = new THREE.CanvasTexture(roadCanvas);
    roadTex.wrapS = THREE.RepeatWrapping;
    roadTex.wrapT = THREE.RepeatWrapping;
    roadTex.repeat.set(1, 40);

    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 800),
      new THREE.MeshBasicMaterial({ map: roadTex })
    );
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -390);
    scene.add(road);

    // ── Dashed centre line ───────────────────────────────────────────────────
    const dashCanvas = document.createElement("canvas");
    dashCanvas.width = 32;
    dashCanvas.height = 512;
    const dctx = dashCanvas.getContext("2d")!;
    dctx.clearRect(0, 0, 32, 512);
    dctx.fillStyle = light ? "#C8A800" : "#FFD100";
    const dashH = 120;
    const gapH  = 90;
    let dy = 0;
    while (dy < 512) {
      dctx.fillRect(10, dy, 12, dashH);
      dy += dashH + gapH;
    }
    const dashTex = new THREE.CanvasTexture(dashCanvas);
    dashTex.wrapS = THREE.RepeatWrapping;
    dashTex.wrapT = THREE.RepeatWrapping;
    dashTex.repeat.set(1, 50);

    const dashLine = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 800),
      new THREE.MeshBasicMaterial({ map: dashTex, transparent: true, opacity: 0.85 })
    );
    dashLine.rotation.x = -Math.PI / 2;
    dashLine.position.set(0, 0.01, -390);
    scene.add(dashLine);

    // ── Horizon glow ─────────────────────────────────────────────────────────
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 512;
    glowCanvas.height = 128;
    const gctx = glowCanvas.getContext("2d")!;
    const grad = gctx.createRadialGradient(256, 128, 0, 256, 128, 256);
    grad.addColorStop(0,   light ? "rgba(200,160,0,0.55)" : "rgba(255,180,20,0.45)");
    grad.addColorStop(0.4, light ? "rgba(180,80,20,0.2)"  : "rgba(200,60,20,0.18)");
    grad.addColorStop(1,   "rgba(0,0,0,0)");
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 512, 128);
    const glowTex = new THREE.CanvasTexture(glowCanvas);

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(280, 40),
      new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, opacity: 0.8, depthWrite: false })
    );
    glow.position.set(0, 4, -380);
    scene.add(glow);

    // ── Scroll-driven render ─────────────────────────────────────────────────
    // Scene is static at rest. Scroll drives camera forward down the road and
    // advances the road/dash textures to reinforce motion.
    let rafId: number;
    let lastScroll = window.scrollY;
    let offset = 0;
    let needsRender = true;

    const MAX_Z = -280; // don't drive past the fog wall

    const onScroll = () => {
      const scroll  = window.scrollY;
      const delta   = scroll - lastScroll;
      lastScroll    = scroll;

      // road and dash textures scroll forward
      offset += delta * 0.0015;
      dashTex.offset.y  = offset % 1;
      roadTex.offset.y  = (offset * 0.4) % 1;
      dashTex.needsUpdate = true;
      roadTex.needsUpdate = true;

      // camera drives forward along Z + gentle lateral drift
      camera.position.z = Math.max(-(scroll * 0.12), MAX_Z);
      camera.position.x = Math.sin(scroll * 0.0008) * 0.5;
      camera.lookAt(camera.position.x, 1.2, camera.position.z - 60);

      needsRender = true;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    function loop() {
      rafId = requestAnimationFrame(loop);
      if (!needsRender) return;
      renderer.render(scene, camera);
      needsRender = false;
    }
    loop();

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      needsRender = true;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="highway-scene"
      aria-hidden="true"
    />
  );
}
