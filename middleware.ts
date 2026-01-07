import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const session = req.auth;

  // Not logged in => go to login
  if (!session) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Optional: admin role check (if you set role in auth.ts)
  const role = (session.user as any)?.role;
  if (role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
