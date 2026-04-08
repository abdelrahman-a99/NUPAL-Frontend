/**
 * Browser and server-safe base URL for the Career Hub proxy (`/api/career-services/...`).
 */
export function careerServicesApiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/career-services${p}`;
  }
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${origin}/api/career-services${p}`;
}
