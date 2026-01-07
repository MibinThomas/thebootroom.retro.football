import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // ✅ Allow NextAuth routes always
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // ✅ Allow admin login page always (otherwise infinite loop)
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Everything else under /admin or /api/admin requires session
  const session = req.auth;

  if (!session) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Optional: role check (only if you're setting role="admin" in auth.ts)
  const role = (session.user as any)?.role;
  if (role && role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/:path*"],
};
