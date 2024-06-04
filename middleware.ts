import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import { redirect } from "next/navigation";

// export default withAuth(
//   // `withAuth` augments your `Request` with the user's token.
//   function middleware(req) {
//     // console.log(req.nextauth.token);
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// );

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // console.log(req.nextauth);
    if (
      req.nextUrl.pathname === "/dashboard/users" &&
      req.nextauth.token?.role !== "Admin"
    ) {
      return new NextResponse("You are not authorized!");
    } else if (
      req.nextUrl.pathname === "/dashboard/briefs/create" &&
      req.nextauth.token?.role !== "Customer Service" &&
      req.nextauth.token?.role !== "Admin"
    ) {
      return new NextResponse("You are not authorized!");
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
