// Copyright © MJMDG 2026
import type { Route } from "./+types/home";
import nutzsack from "../assets/images/misc/futuristice-geometric-nutzack-transparent.jpeg";
import logo from "../assets/images/peeps/mdg-bald-icon.jpg";
import nunavutBg from "../assets/images/bg/Nunavut.jpg";
import darkLogo from "../assets/images/logos/v1.0.1.6/white-1.png";
import lightLogo from "../assets/images/logos/v1.0.1.6/black-1.png";
import { useRef, useState, useEffect } from "react";
import PageLayout from "~/components/PageLayout";
import Alert from "~/components/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { pool } from "../db/db.server";
import bcrypt from "bcryptjs";
import { redirect, data } from "react-router";
import { Form, useNavigate } from "react-router";
import { sessionStorage } from "../db/session.server";

interface SpawnItem {
  id: number;
  edge: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "MJMDG" },
    { name: "description", content: "Development Environment" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  return {
    registered: url.searchParams.get("registered") === "true",
    loggedOut: url.searchParams.get("loggedOut") === "true",
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const username = String(formData.get("username"));
  const password = String(formData.get("password"));

  try {
    const result = await pool.query(
      `SELECT * FROM "User" WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!user) {
      return data({ error: "Invalid username or password" }, { status: 400 });
    }

    const isValid = await bcrypt.compare(password, user.hashed_password);

    if (!isValid) {
      return data({ error: "Invalid username or password" }, { status: 400 });
    }

    const session = await sessionStorage.getSession();
    session.set("userId", user.id);

    return redirect("/dashboard", {
      headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
    });
  } catch (err) {
    console.error(err);
    return data({ error: "Something went wrong" }, { status: 500 });
  }
}

export default function Home({ actionData, loaderData }: Route.ComponentProps) {
  const [items, setItems] = useState<SpawnItem[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const navigate = useNavigate();
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Secret entry point: click the MJMDG logo 5x in quick succession to reach
  // /dev-settings. Home-page only, on purpose — see app/docs/DEV_SETTINGS.md.
  function handleLogoClick() {
    logoClickCount.current += 1;
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      navigate("/dev-settings");
      return;
    }
    logoClickTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, 1500);
  }
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    document.body.classList.add('page-home');
    return () => document.body.classList.remove('page-home');
  }, []);

  useEffect(() => {
    if (loaderData?.registered || loaderData?.loggedOut) {
      window.history.replaceState({}, "", "/");
    }
  }, []);

  useEffect(() => {
    const update = () =>
      setTheme((document.documentElement.getAttribute("data-theme") as "dark" | "light") ?? "dark");
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!actionData?.error) return;
    setShowError(true);
  }, [actionData]);

  const spawnItem = () => {
    const id = Date.now();
    const edges = ["top", "bottom", "left", "right"];
    const edge = edges[Math.floor(Math.random() * edges.length)];
    const rand = Math.random() * 100;

    let position: Partial<SpawnItem> = {};

    if (edge === "top") position = { top: "-60px", left: `${rand}%` };
    if (edge === "bottom") position = { bottom: "-60px", left: `${rand}%` };
    if (edge === "left") position = { left: "-60px", top: `${rand}%` };
    if (edge === "right") position = { right: "-60px", top: `${rand}%` };

    setItems((prev) => [...prev, { id, edge, ...position }]);

    // auto remove after animation
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 1200);
  };


  const handleWelcomeClick = () => {
    if (isActive) {
      clearInterval(intervalRef.current ?? undefined);
      intervalRef.current = null;
      setIsActive(false);
      setClickCount(0);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      return;
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1000);

    if (newCount >= 5) {
      setIsActive(true);
      intervalRef.current = setInterval(spawnItem, 300);
      clearTimeout(clickTimeoutRef.current);
    }
  };

  return (
    <PageLayout>
      <section className="home-hero">
        {/* Photo layer */}
        <div className="home-hero-media">
          <img src={nunavutBg} alt="" className="home-hero-img" />
          <div className="home-hero-overlay" aria-hidden="true" />
          {/* Mobile-only: headline floated over the photo */}
          <div className="home-hero-mobile-headline" aria-hidden="true">
            <h2 className="hero-title">Plan.<br /><span>Execute.</span><br />Deliver.</h2>
            <p className="hero-sub">Forge the future — one idea at a time.</p>
          </div>
        </div>

        {/* Desktop: three-col grid absolutely over image | Mobile: in-flow below image */}
        <div className="home-hero-inner">
          {/* Col 1: form */}
          <div className="formContainer home-hero-panel">
            <button
              onClick={handleWelcomeClick}
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <h1 style={{ color: isActive ? "#FF3EFF" : "var(--text-primary)", transition: "0.3s" }}>
                Welcome
              </h1>
            </button>

            <Form method="post">
              <label id="username" className="fieldLabel">
                Username
                <input
                  className="field"
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setShowError(false); setShowBanner(false); }}
                  required
                />
              </label>
              <label id="password" className="fieldLabel">
                Password
                <div className="field-wrapper">
                  <input
                    className="field"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setShowError(false); setShowBanner(false); }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="field-reset-btn"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </label>
              {showBanner && loaderData?.registered && <Alert variant="success" message="Account created successfully. Please log in." />}
              {showBanner && loaderData?.loggedOut && <Alert variant="success" message="You have been logged out." />}
              {showError && actionData?.error && <Alert variant="error" message={actionData.error} />}
              <button type="submit" className="button" disabled={!username && !password} style={{ background: "var(--brand-blue)", borderColor: "var(--brand-blue)" }}>
                {username && password
                  ? <img src={logo} alt="Login" style={{ height: "6rem", borderRadius: "50%" }} />
                  : "Submit"}
              </button>
            </Form>

            {items.map((item) => (
              <img key={item.id} src={nutzsack} className={`spawn ${item.edge}`} style={item} />
            ))}
          </div>

          {/* Col 2: headline */}
          <div className="home-hero-copy">
            <h1 className="hero-title">Plan.<br /><span>Execute.</span><br />Deliver.</h1>
            <p className="hero-sub">Forge the future — one idea at a time.</p>
          </div>

          {/* Col 3: branding */}
          <div className="home-hero-branding">
            <img
              src={theme === "light" ? lightLogo : darkLogo}
              alt="MJMDG"
              className="home-hero-branding-logo"
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            />
            <span className="home-hero-branding-name">MJMDG</span>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
