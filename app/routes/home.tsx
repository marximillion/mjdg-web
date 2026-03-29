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
          <label htmlFor="firstName" className="fieldLabel">
            {"First Name"}
          </label>
          <input
            className="field"
            type="text"
            name="firstName"
            placeholder="Enter first name"
          />
          <label htmlFor="lastName" className="fieldLabel">
            {"Last Name"}
          </label>
          <input
            className="field"
            type="text"
            name="lastName"
            placeholder="Enter last name"
          />
          <button type="submit" className="button">
            {"Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
