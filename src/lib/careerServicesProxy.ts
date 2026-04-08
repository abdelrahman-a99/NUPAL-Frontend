import { NextRequest, NextResponse } from "next/server";

const upstream = () => process.env.CAREER_SERVICES_URL?.replace(/\/$/, "");
const apiKey = () => process.env.CAREER_SERVICES_API_KEY;

/**
 * Forwards the request to the FastAPI Career Services deployment (e.g. Hugging Face Space).
 * Sends the user Bearer token when present and adds X-API-Key for service authentication.
 */
export async function proxyToCareerServices(
  request: NextRequest,
  pathSegments: string[]
): Promise<Response> {
  const base = upstream();
  if (!base) {
    return NextResponse.json(
      { error: "CAREER_SERVICES_URL is not configured on the server" },
      { status: 503 }
    );
  }

  const path = pathSegments.join("/");
  const incoming = new URL(request.url);
  const target = new URL(`${base}/${path}`);
  target.search = incoming.search;

  const headers = new Headers();
  const auth = request.headers.get("authorization");
  if (auth) headers.set("Authorization", auth);
  const key = apiKey();
  if (key) headers.set("X-API-Key", key);

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "follow",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    const body = await request.arrayBuffer();
    const ct = request.headers.get("content-type");
    if (ct) headers.set("Content-Type", ct);
    init.body = body;
  }

  try {
    const res = await fetch(target.toString(), init);
    return new NextResponse(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  } catch (e) {
    console.error("careerServicesProxy:", e);
    return NextResponse.json(
      {
        error: "Upstream career service unreachable",
        message: e instanceof Error ? e.message : String(e),
      },
      { status: 502 }
    );
  }
}
