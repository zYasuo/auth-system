import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const { pathname } = request.nextUrl

  const isAuthenticated = !!token
  const isAuthPage = pathname.startsWith("/signin") || pathname.startsWith("/signup")
  const isProtectedPage = pathname.startsWith("/user") || pathname.startsWith("/dashboard")
  const isRootPage = pathname === "/"

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/user", request.url))
  }

  if (!isAuthenticated && (isProtectedPage || isRootPage)) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  if (isAuthenticated && isRootPage) {
    return NextResponse.redirect(new URL("/user", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
