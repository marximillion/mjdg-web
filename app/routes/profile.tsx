import type { Route } from "./+types/profile";
import { Form, redirect, data } from "react-router";
import { useState } from "react";
import PageLayout from "~/components/PageLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
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
  const [fields, setFields] = useState({
    email: user.email ?? "",
    first_name: user.first_name ?? "",
    last_name: user.last_name ?? "",
  });
  const [original, setOriginal] = useState(fields);

  const hasChanges =
    fields.email !== original.email ||
    fields.first_name !== original.first_name ||
    fields.last_name !== original.last_name;

  function handleEdit() {
    setOriginal(fields);
    setIsEditing(true);
  }

  function handleCancel() {
    setFields(original);
    setIsEditing(false);
  }

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
              value={user.username}
              disabled
              readOnly
            />
          </label>
          <label htmlFor="email" className="fieldLabel">
            Email
            <div className="field-wrapper">
              <input
                id="email"
                className="field"
                type="email"
                name="email"
                value={fields.email}
                disabled={!isEditing}
                onChange={(e) => setFields({ ...fields, email: e.target.value })}
                style={isEditing && fields.email !== original.email ? { paddingRight: "2rem" } : undefined}
              />
              {isEditing && fields.email !== original.email && (
                <button type="button" className="field-reset-btn" onClick={() => setFields({ ...fields, email: original.email })}><FontAwesomeIcon icon={faArrowRotateLeft} /></button>
              )}
            </div>
          </label>
          <label htmlFor="first_name" className="fieldLabel">
            First Name
            <div className="field-wrapper">
              <input
                id="first_name"
                className="field"
                type="text"
                name="first_name"
                value={fields.first_name}
                disabled={!isEditing}
                onChange={(e) => setFields({ ...fields, first_name: e.target.value })}
                style={isEditing && fields.first_name !== original.first_name ? { paddingRight: "2rem" } : undefined}
              />
              {isEditing && fields.first_name !== original.first_name && (
                <button type="button" className="field-reset-btn" onClick={() => setFields({ ...fields, first_name: original.first_name })}><FontAwesomeIcon icon={faArrowRotateLeft} /></button>
              )}
            </div>
          </label>
          <label htmlFor="last_name" className="fieldLabel">
            Last Name
            <div className="field-wrapper">
              <input
                id="last_name"
                className="field"
                type="text"
                name="last_name"
                value={fields.last_name}
                disabled={!isEditing}
                onChange={(e) => setFields({ ...fields, last_name: e.target.value })}
                style={isEditing && fields.last_name !== original.last_name ? { paddingRight: "2rem" } : undefined}
              />
              {isEditing && fields.last_name !== original.last_name && (
                <button type="button" className="field-reset-btn" onClick={() => setFields({ ...fields, last_name: original.last_name })}><FontAwesomeIcon icon={faArrowRotateLeft} /></button>
              )}
            </div>
          </label>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            {!isEditing ? (
              <button type="button" className="button" onClick={handleEdit}>
                Edit
              </button>
            ) : (
              <>
                <button type="button" className="button" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="button" disabled={!hasChanges}>
                  Save
                </button>
              </>
            )}
          </div>
        </Form>
      </div>
    </PageLayout>
  );
}