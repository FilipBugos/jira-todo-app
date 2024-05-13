import NextAuth from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

import { authConfig } from "../auth.config";

export default NextAuth(authConfig).auth;

export function middleware(request: NextRequest) {
  // const isAuthenticated = authenticate(request);
  // // If the user is authenticated, continue as normal
  // if (isAuthenticated) {
  //   return NextResponse.next();
  // }
  // // Redirect to login page if not authenticated
  // return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
