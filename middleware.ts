import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // Auth check will be added when NextAuth is integrated
  return NextResponse.next();
}

export const config = {
  matcher: ["/theses/:slug*"],
};
