import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLogin = true;
  if (isLogin) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  } else {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: ["/briefs/:path*", "/users/:path*", "/dashboard/:path*"],
};
