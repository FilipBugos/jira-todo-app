import { auth as middleware } from "next-auth/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { decrypt } from "@/lib/session";

const protectedRoutes = [
  "/profile",
  "/issue",
  "/projects",
  "/logout",
  "/active-sprint",
  "/all-issues",
  "/backlog",
];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const cookieFromReq = req.cookies.get("authjs.session-token")?.value;
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);
  if (isProtectedRoute && (!session?.userId || !cookieFromReq)) {
    console.log("SSSSSSession");
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  console.log(
    "req.nextUrl.pathname.startsWith('/')",
    req.nextUrl.pathname.startsWith("/"),
  );

  let isSessionOrCookieValid: boolean;

  if (session?.userId || cookieFromReq) {
    isSessionOrCookieValid = true;
  } else {
    isSessionOrCookieValid = false;
  }
  isSessionOrCookieValid;

  console.log("isPublicRoute", isPublicRoute);
  console.log("isSessionOrCookieValid", isSessionOrCookieValid);
  console.log(
    "req.nextUrl.pathname.startsWith('/')",
    isPublicRoute &&
      isSessionOrCookieValid &&
      !req.nextUrl.pathname.startsWith("/"),
  );
  if (
    isPublicRoute &&
    isSessionOrCookieValid &&
    !req.nextUrl.pathname.startsWith("/")
  ) {
    console.log("session-cookie", session, cookieFromReq);
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  console.log("Session next", path);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
