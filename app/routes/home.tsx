import type { Route } from "./+types/home";
import logo from "../assets/logo-lab3-white.png";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "LAB<3 Development" },
    { name: "description", content: "Development Environment" },
  ];
}

export default function Home() {
  const title = "Lab<3 Development";
  return (

    <div className="screenContainer">
      <nav>
        <a href="#home">Home</a>
        <a href="#portfolio">Portfolio</a>
      </nav>
      <section id="home">
        <h1>Welcome</h1>
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
        </form>
      </div>
    </div>
  );
}
