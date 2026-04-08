import { NextRequest } from "next/server";
import { proxyToCareerServices } from "@/lib/careerServicesProxy";

type RouteCtx = { params: Promise<{ path: string[] }> };

async function handle(request: NextRequest, context: RouteCtx) {
  const { path } = await context.params;
  return proxyToCareerServices(request, path);
}

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
export const PUT = handle;
export const PATCH = handle;
