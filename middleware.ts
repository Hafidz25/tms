import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    if (
      req.nextUrl.pathname === "/dashboard/users" &&
      req.nextauth.token?.role !== "Admin"
    ) {
      return new NextResponse("You are not authorized!", {
        status: 403,
      });
    } else if (
      req.nextUrl.pathname === "/dashboard/briefs/create" &&
      req.nextauth.token?.role !== "Customer Service" &&
      req.nextauth.token?.role !== "Admin"
    ) {
      return new NextResponse("You are not authorized!", {
        status: 403,
      });
    } else if (
      req.nextUrl.pathname === "/dashboard/payslips/create" &&
      req.nextauth.token?.role !== "Admin"
    ) {
      return new NextResponse("You are not authorized!", {
        status: 403,
      });
    }
  },
  {
    callbacks: {
      authorized: (params) => {
        let { token } = params;
        return !!token;
      },
    },
  }
);

export const config = { matcher: ["/dashboard/:path*"] };
