/**
 * Universal safe base URL routing career services directly into the .NET Core API proxy.
 */
export function careerServicesApiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const origin =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:5009");
  return `${origin}/api/ai-proxy${p}`;
}
