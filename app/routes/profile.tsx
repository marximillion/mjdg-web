import type { Route } from "./+types/profile";
import { Form, redirect, data } from "react-router";
import { useState } from "react";
import PageLayout from "~/components/PageLayout";
import { pool } from "../db/db.server";
import { getUserFromSession } from "../db/session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile | LAB<3" },
    { name: "description", content: "Your profile" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  if (!userId) return redirect("/");

  const result = await pool.query(
    `SELECT id, username, email, first_name, last_name FROM "User" WHERE id = $1`,
    [userId]
  );

  const user = result.rows[0];
  return { isAuthenticated: true, user };
}

export async function action({ request }: Route.ActionArgs) {
  const userId = await getUserFromSession(request);
  if (!userId) return redirect("/");

  const formData = await request.formData();
  const email = formData.get("email") ? String(formData.get("email")) : null;
  const first_name = formData.get("first_name") ? String(formData.get("first_name")) : null;
  const last_name = formData.get("last_name") ? String(formData.get("last_name")) : null;

  try {
    await pool.query(
      `UPDATE "User" SET email = $1, first_name = $2, last_name = $3 WHERE id = $4`,
      [email, first_name, last_name, userId]
    );

    return data({ success: "Profile updated" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return data({ error: "Something went wrong" }, { status: 500 });
  }
}

export default function Profile({ loaderData, actionData }: Route.ComponentProps) {
  const { user } = loaderData;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <div className="formContainer">
        <h1>Profile</h1>

        <Form method="post">
          <label htmlFor="username" className="fieldLabel">
            Username
            <input
              id="username"
              className="field"
              type="text"
              name="username"
              defaultValue={user.username}
              disabled
            />
          </label>
          <label htmlFor="email" className="fieldLabel">
            Email
            <input
              id="email"
              className="field"
              type="email"
              name="email"
              defaultValue={user.email ?? ""}
              disabled={!isEditing}
            />
          </label>
          <label htmlFor="first_name" className="fieldLabel">
            First Name
            <input
              id="first_name"
              className="field"
              type="text"
              name="first_name"
              defaultValue={user.first_name ?? ""}
              disabled={!isEditing}
            />
          </label>
          <label htmlFor="last_name" className="fieldLabel">
            Last Name
            <input
              id="last_name"
              className="field"
              type="text"
              name="last_name"
              defaultValue={user.last_name ?? ""}
              disabled={!isEditing}
            />
          </label>

          {/* {actionData?.error && (
            <p style={{ color: "red" }}>{actionData.error}</p>
          )}
          {actionData?.success && (
            <p style={{ color: "limegreen" }}>{actionData.success}</p>
          )} */}

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button
              type="button"
              className="button"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            {isEditing && (
              <button type="submit" className="button">
                Save
              </button>
            )}
          </div>
        </Form>
      </div>
    </PageLayout>
  );
}