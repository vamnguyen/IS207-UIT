import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths: string[] = [
  "/",
  "/login",
  "/register",
  "/categories",
  "/products",
  "/about",
  "/contact",
  "/faq",
  "/terms",
  "/privacy",
  "/help",
  "/auth/social-callback",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  // Check nếu route bắt đầu bằng public path nào đó
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  if (token && isAuthRoute) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Nếu không phải public và chưa có token -> redirect về login
  if (!isPublic && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Áp dụng middleware cho tất cả routes, trừ static files/_next
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
