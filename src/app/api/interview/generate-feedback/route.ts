import { NextRequest } from "next/server";
import { proxyToCareerServices } from "@/lib/careerServicesProxy";

export async function POST(request: NextRequest) {
  return proxyToCareerServices(request, ["v1", "interview", "generate-feedback"]);
}
