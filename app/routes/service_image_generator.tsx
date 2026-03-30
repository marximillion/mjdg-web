import { redirect, useNavigation } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/service_image_generator";
import PageLayout from "~/components/PageLayout";
import { getUserFromSession } from "~/db/session.server";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Text to Image Generator | LAB<3" },
    { name: "description", content: "Generate images from text using AI" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  if (!userId) return redirect("/");
  return { isAuthenticated: true };
}

export async function action({ request }: Route.ActionArgs) {
  const userId = await getUserFromSession(request);
  if (!userId) return redirect("/");

  const formData = await request.formData();
  const text = formData.get("text") as string;

  const resp = await fetch("https://api.deepai.org/api/text2img", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.DEEPAI_API_KEY ?? "",
    },
    body: JSON.stringify({ text }),
  });

  const data = await resp.json();
  if (!resp.ok || data.err) {
    if (resp.status === 402) {
      return { imageUrl: null, error: "API error: Payment Required" };
    }
    return { imageUrl: null, error: data.err ?? `API error: ${resp.status}` };
  }

  return { imageUrl: data.output_url ?? null, error: null };
}

export default function ServiceImageGenerator({ loaderData, actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isGenerating = navigation.state === "submitting";

  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <section id="image-generator">
        <h1>Text to Image Generator</h1>
        <div className="formContainer">
          <form method="post">
            <div className="field-group">
              <label htmlFor="text" className="fieldLabel">Describe your image</label>
              <textarea
                id="text"
                name="text"
                className="field"
                rows={4}
                placeholder="A synthwave sunset over a neon city..."
                required
              />
            </div>
            <button type="submit" className="button" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Image"}
            </button>
          </form>

          {actionData?.error && (
            <p style={{ color: "var(--neon-pink)", marginTop: "1rem" }}>
              Error: {actionData.error}
            </p>
          )}

          {actionData?.imageUrl && (
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <img
                src={actionData.imageUrl}
                alt="Generated"
                style={{ maxWidth: "100%", borderRadius: "1rem", border: "2px solid var(--purple)" }}
              />
              <p>
                <a href={actionData.imageUrl} download style={{ color: "var(--cyan)" }}>
                  Download Image
                </a>
              </p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
