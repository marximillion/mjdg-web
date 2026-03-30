import type { Route } from "./+types/home";
import logo from "../assets/futuristice-geometric-nutzack-transparent.jpeg";
import { useRef, useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "LAB<3 Development" },
    { name: "description", content: "Development Environment" },
  ];
}

export default function Home() {
  const title = "Lab<3 Development";
  const [items, setItems] = useState<any[]>([]);
  const [isSpawning, setIsSpawning] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const clickTimeoutRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  const spawnItem = () => {
    const id = Date.now();

    const edges = ["top", "bottom", "left", "right"];
    const edge = edges[Math.floor(Math.random() * edges.length)];

    const rand = Math.random() * 100;

    let position: any = {};



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
  // 🔴 If active → FULL RESET
  if (isActive) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    setIsActive(false);
    setClickCount(0);

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    return;
  }

  // 🟡 Increment clicks
  const newCount = clickCount + 1;
  setClickCount(newCount);

  // ⏱️ Reset timer (must keep clicking fast)
  if (clickTimeoutRef.current) {
    clearTimeout(clickTimeoutRef.current);
  }

  clickTimeoutRef.current = setTimeout(() => {
    setClickCount(0); // ⬅️ reset if too slow
  }, 1000); // 👈 adjust timing (1s window)

  // 🟢 Activate if fast enough
  if (newCount >= 5) {
    setIsActive(true);

    intervalRef.current = setInterval(() => {
      spawnItem();
    }, 300);

    clearTimeout(clickTimeoutRef.current);
  }
};

  return (

    <div className="screenContainer">
      <nav>
        <a href="#home">Home</a>
        <a href="#portfolio">Portfolio</a>
      </nav>
      <section id="home">
        {/* <h1>Welcome</h1> */}
        <h1
          onClick={handleWelcomeClick}
          
          style={{
            cursor: "pointer",
            color: isActive ? "limegreen" : "white",
            // color: !isUnlocked
            //   ? "white"
            //   : isSpawning
            //   ? "limegreen"
            //   : "crimson",
            transition: "0.3s",
          }}
        >
          Welcome
        </h1>
        
        <p>Hello! This is your portfolio home page. Share your story, skills, and projects here to showcase your work
          and expertise to the world.</p>
      </section>
      <div className="formContainer">
        <div className="bannerContainer" />
        <form onSubmit={() => { }}>
          <label id="firstName" className="fieldLabel">
            {"First Name"}
            <input
              className="field"
              type="text"
              name="firstName"
              placeholder="Enter first name"
            />
          </label>
          <label id="lastName" className="fieldLabel">
            {"Last Name"}
            <input
              className="field"
              type="text"
              name="lastName"
              placeholder="Enter last name"
            />
          </label>
          <button type="submit" className="button">
            {"Submit"}
          </button>
          {/* <button
            type="button"
            className="button"
            onClick={toggleSpawning}
          >
            {isSpawning ? "STOP 😈" : "I LOVE TITS"}
          </button> */}
        </form>
      </div>

      {items.map((item) => (
        <img
          key={item.id}
          src={logo} // or any asset you want
          className={`spawn ${item.edge}`}
          style={item}
        />
      ))}

    </div>
  );
}
