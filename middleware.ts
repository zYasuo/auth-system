// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWTUtils, type CustomJWTPayload } from "@/lib/auth/jwt/utils";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  
  const protectedRoutes = ["/user", "/forms"];
  const isProtectedPage = protectedRoutes.includes(request.nextUrl.pathname);
  
  const isRootPage = request.nextUrl.pathname === "/";
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isAuthPage = ["/signin", "/signup"].includes(request.nextUrl.pathname);

    if (isRootPage) {
    if (accessToken) {
      const payload: CustomJWTPayload | null = await JWTUtils.verifyAccessToken(accessToken)

      if (payload) {
        return NextResponse.redirect(new URL("/user", request.url))
      } else if (refreshToken) {
        return NextResponse.redirect(new URL("/api/auth/refresh", request.url))
      } else {
        return NextResponse.redirect(new URL("/signin", request.url))
      }
    } else {
      return NextResponse.redirect(new URL("/signin", request.url))
    }
  }

  if (isProtectedPage) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const payload: CustomJWTPayload | null = await JWTUtils.verifyAccessToken(
      accessToken
    );

    if (!payload) {
      if (refreshToken) {
        return NextResponse.redirect(new URL("/api/auth/refresh", request.url));
      }
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  if (isAuthPage && accessToken) {
    const payload: CustomJWTPayload | null = await JWTUtils.verifyAccessToken(
      accessToken
    );
    if (payload) {
      return NextResponse.redirect(new URL("/user", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
