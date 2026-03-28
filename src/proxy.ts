import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  const protectedPaths = ["/dashboard", "/posts", "/calendar", "/analytics", "/accounts", "/campaigns", "/settings"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/posts/:path*", "/calendar/:path*", "/analytics/:path*", "/accounts/:path*", "/campaigns/:path*", "/settings/:path*"],
};
