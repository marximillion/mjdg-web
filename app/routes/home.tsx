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
