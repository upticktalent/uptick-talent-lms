import { NextResponse } from "next/server";

/**
 * POST /api/assessment-submissions
 *
 * - Accepts { email, githubLink, liveDemoLink }
 * - Performs basic server-side validation
 * - If BACKEND_API_URL (see env notes below) is set, forwards the request to the real backend.
 * - Otherwise returns a mocked 201 response so frontend can work while backend is not ready.
 *
 * Env notes:
 * - When the backend endpoint is available, set an environment variable in your Next app:
 *     NEXT_PUBLIC_BACKEND_API_URL=https://your-backend.example.com
 *   or (server-only)
 *     BACKEND_API_URL=https://your-backend.example.com
 *
 * - Then replace the forwarding path below with the actual backend route (example: `${backendUrl}/api/assessment-submissions`).
 * - Add any required auth headers when forwarding (Authorization, API keys, etc.).
 */

const isValidEmail = (v?: unknown) =>
  typeof v === "string" && /^\S+@\S+\.\S+$/.test(v.trim());

const isValidUrl = (v?: unknown) => {
  if (typeof v !== "string") return false;
  try {
    const u = new URL(v.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, githubLink, liveDemoLink } = body ?? {};

    // Basic validation
    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Invalid or missing email" }, { status: 400 });
    }
    if (!isValidUrl(githubLink)) {
      return NextResponse.json({ message: "Invalid or missing GitHub repository URL" }, { status: 400 });
    }
    if (!isValidUrl(liveDemoLink)) {
      return NextResponse.json({ message: "Invalid or missing live demo URL" }, { status: 400 });
    }

    // If a backend URL is configured, forward the submission there.
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL ?? process.env.BACKEND_API_URL ?? null;

    if (backendUrl) {
      // TODO: backend's endpoint when available.
      const forwardTo = `${backendUrl.replace(/\/$/, "")}/api/assessment-submissions`;

      // Example headers: For Authorization if backend requires it.
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      //  to include a server-side secret token, add it from env:
      // headers['Authorization'] = `Bearer ${process.env.BACKEND_API_TOKEN}`;

      const resp = await fetch(forwardTo, {
        method: "POST",
        headers,
        body: JSON.stringify({ email, githubLink, liveDemoLink }),
      });

      const respBody = await resp.json().catch(() => ({}));
      return NextResponse.json(respBody, { status: resp.status });
    }

    // No backend configured — return a mocked success so frontend can proceed during development.
    // Replace this with forwarding (above) once backend is available.
    console.log("Mock save assessment submission:", { email, githubLink, liveDemoLink });

    // simulated delay (optional)
    await new Promise((r) => setTimeout(r, 300));

    return NextResponse.json(
      { message: "Submission received (mock)", data: { email, githubLink, liveDemoLink } },
      { status: 201 }
    );
  } catch (err) {
    console.error("API route error: /api/assessment-submissions", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}