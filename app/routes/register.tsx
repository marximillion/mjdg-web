// Copyright © MJDG 2026
import type { Route } from "./+types/register";
import { Form, redirect, data } from "react-router";
import { useState } from "react";
import PageLayout from "~/components/PageLayout";
import logo from "../assets/images/peeps/mdg-bald-icon.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { pool } from "../db/db.server";
import bcrypt from "bcryptjs";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Register | LAB<3" },
        { name: "description", content: "Create an account" },
    ];
}

export async function loader({ request }: Route.LoaderArgs) {
    return {};
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const username = String(formData.get("username"));
    const password = String(formData.get("password"));
    const email = formData.get("email") ? String(formData.get("email")) : null;
    const first_name = formData.get("first_name") ? String(formData.get("first_name")) : null;
    const last_name = formData.get("last_name") ? String(formData.get("last_name")) : null;

    try {
        const hashed_password = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO "User" (username, password, hashed_password, email, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5, $6)`,
            [username, password, hashed_password, email, first_name, last_name]
        );

        return redirect("/");
    } catch (err: any) {
        if (err.code === "23505") {
            return data({ error: "Username or email already taken" }, { status: 400 });
        }
        console.error(err);
        return data({ error: "Something went wrong" }, { status: 500 });
    }
}

export default function Register({ actionData }: Route.ComponentProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    return (
        <PageLayout>
            <div className="formContainer">

                <Form method="post">
                    <label htmlFor="username" className="fieldLabel">
                        Username*
                        <input
                            id="username"
                            className="field"
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                    <label htmlFor="password" className="fieldLabel">
                        Password*
                        <div className="field-wrapper">
                            <input
                                id="password"
                                className="field"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                    <label htmlFor="email" className="fieldLabel">
                        Email
                        <input
                            id="email"
                            className="field"
                            type="email"
                            name="email"
                            placeholder="Enter email"
                        />
                    </label>
                    <label htmlFor="first_name" className="fieldLabel">
                        First Name
                        <input
                            id="first_name"
                            className="field"
                            type="text"
                            name="first_name"
                            placeholder="Enter first name"
                        />
                    </label>
                    <label htmlFor="last_name" className="fieldLabel">
                        Last Name
                        <input
                            id="last_name"
                            className="field"
                            type="text"
                            name="last_name"
                            placeholder="Enter last name"
                        />
                    </label>
                    {actionData?.error && (
                        <p style={{ color: "red" }}>{actionData.error}</p>
                    )}
                    <button
                        type="submit"
                        className="button"
                        // disabled={!username && !password}
                    >
                        {username && password
                            ? <img src={logo} alt="Register" style={{ height: "6rem", borderRadius: "50%" }} />
                            : "Register"}
                    </button>
                </Form>
            </div>
        </PageLayout>
    );
}