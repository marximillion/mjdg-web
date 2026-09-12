// Copyright © MJMDG 2026
import { useEffect, useRef } from "react";
import { useNavigation } from "react-router";
import carImg from "../assets/images/logos/fd5-blue-icon-v2.png";

const CAR_ANIM_MS = 900;
const TRIGGER_PATHS = new Set(["/", "/logout"]);

function isTrackedAction(formAction: string | undefined): boolean {
  if (!formAction) return false;
  try {
    // formAction may be a full URL or just a pathname
    const path = new URL(formAction, "http://x").pathname;
    return TRIGGER_PATHS.has(path);
  } catch {
    return TRIGGER_PATHS.has(formAction);
  }
}

export default function Loader() {
  const navigation = useNavigation();
  const overlayRef    = useRef<HTMLDivElement>(null);
  const carRef        = useRef<HTMLImageElement>(null);
  const fillRef       = useRef<HTMLDivElement>(null);
  const statusRef     = useRef<HTMLDivElement>(null);
  const wrapRef       = useRef<HTMLDivElement>(null);
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const navIdleRef    = useRef(false);
  const carDoneRef    = useRef(false);
  const activeRef     = useRef(false);
  const flashFiredRef = useRef(false);
  const actionRef     = useRef<string>("");

  function triggerFlash() {
    if (!navIdleRef.current || !carDoneRef.current || flashFiredRef.current) return;
    flashFiredRef.current = true;

    const overlay = overlayRef.current;
    const fill    = fillRef.current;
    const status  = statusRef.current;
    const wrap    = wrapRef.current;
    if (!overlay || !fill || !status || !wrap) return;

    fill.style.transition = "width 0.15s ease-out";
    fill.style.width = "100%";
    status.textContent = actionRef.current === "/logout" ? "Catch ya later." : "All set.";

    setTimeout(() => {
      wrap.classList.add("loader-hazard-on");
      setTimeout(() => {
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.hidden = true;
          overlay.style.opacity = "1";
          wrap.classList.remove("loader-hazard-on");
          activeRef.current = false;
        }, 260);
      }, 750);
    }, 80);
  }

  function startAnimation() {
    const overlay = overlayRef.current;
    const car     = carRef.current;
    const fill    = fillRef.current;
    const status  = statusRef.current;
    if (!overlay || !car || !fill || !status) return;

    activeRef.current    = true;
    navIdleRef.current   = false;
    carDoneRef.current   = false;
    flashFiredRef.current = false;

    overlay.hidden = false;
    overlay.style.opacity = "1";
    fill.style.transition = "none";
    fill.style.width = "0%";
    status.textContent = "Loading...";
    wrapRef.current?.classList.remove("loader-hazard-on");

    car.classList.remove("loader-car-run");
    void car.offsetWidth;
    car.classList.add("loader-car-run");

    const onAnimEnd = () => {
      carDoneRef.current = true;
      if (navIdleRef.current) {
        fill.style.transition = "width 0.15s ease-out";
        fill.style.width = "100%";
      }
      triggerFlash();
      car.removeEventListener("animationend", onAnimEnd);
    };
    car.addEventListener("animationend", onAnimEnd);

    let pct = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      pct = Math.min(pct + Math.random() * 9 + 3, 80);
      fill.style.transition = "width 0.3s ease-out";
      fill.style.width = `${pct}%`;
      if (pct >= 80 && timerRef.current) clearInterval(timerRef.current);
    }, 180);
  }

  useEffect(() => {
    const tracked = isTrackedAction(navigation.formAction);
    const isFormNav = navigation.state === "submitting" || navigation.state === "loading";

    if (isFormNav && tracked && !activeRef.current) {
      try {
        actionRef.current = new URL(navigation.formAction!, "http://x").pathname;
      } catch {
        actionRef.current = navigation.formAction ?? "";
      }
      startAnimation();
    }

    if (navigation.state === "idle" && activeRef.current && !navIdleRef.current) {
      navIdleRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);

      const fill   = fillRef.current;
      const status = statusRef.current;
      if (!fill || !status) return;

      if (carDoneRef.current) {
        fill.style.transition = "width 0.15s ease-out";
        fill.style.width = "100%";
      } else {
        fill.style.transition = `width ${CAR_ANIM_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        fill.style.width = "98%";
      }

      triggerFlash();
    }
  }, [navigation.state, navigation.formAction]);

  return (
    <div ref={overlayRef} className="loader-overlay" hidden aria-live="polite" aria-label="Page loading">
      <div ref={wrapRef} className="loader-car-wrap">
        <img ref={carRef} src={carImg} className="loader-car" alt="" />
        <div className="loader-blinker loader-blinker-left"  aria-hidden="true" />
        <div className="loader-blinker loader-blinker-right" aria-hidden="true" />
      </div>
      <div className="loader-track">
        <div ref={fillRef} className="loader-fill" />
      </div>
      <div ref={statusRef} className="loader-status">Loading...</div>
    </div>
  );
}
