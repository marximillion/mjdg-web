import type { Route } from "./+types/home";
import nutzsack from "../assets/futuristice-geometric-nutzack-transparent.jpeg";
import { useRef, useState } from "react";
import PageLayout from "~/components/PageLayout";
import { pool } from "../db/db.server";
import bcrypt from "bcryptjs";
import { redirect, data } from "react-router";
import { Form } from "react-router";
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
    { title: "LAB<3 Development" },
    { name: "description", content: "Development Environment" },
  ];
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

export default function Home({ actionData }: Route.ComponentProps) {
  const [items, setItems] = useState<SpawnItem[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      <div className="formContainer">
        <button
          onClick={handleWelcomeClick}
          style={{
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          <h1
            style={{
              color: isActive ? "#FF3EFF" : "white",
              transition: "0.3s",
            }}
          >
            Welcome
          </h1>
        </button>
        {/* Banner */}
        <div className="bannerContainer" />

        {/* Login Form */}
        <Form method="post">
          <label id="username" className="fieldLabel">
            Username
            <input
              className="field"
              type="text"
              name="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label id="password" className="fieldLabel">
            Password
            <input
              className="field"
              type="password"
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {actionData?.error && (
            <p style={{ color: "red" }}>{actionData.error}</p>
          )}
          <button type="submit" className="button" disabled={!username && !password}>
            Submit
          </button>
        </Form>

        {items.map((item) => (
          <img
            key={item.id}
            src={nutzsack}
            className={`spawn ${item.edge}`}
            style={item}
          />
        ))}
      </div>
    </PageLayout>
  );
}
