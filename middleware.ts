import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Public paths that don't require auth
const PUBLIC_PATHS = ["/login", "/signup", "/_next", "/favicon.ico", "/api/seed", "/api/create-admin", "/api/create-user"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Read Firebase auth token from cookie set by client SDK (if using)
  // Since we don't set a token cookie here, fall back to a client-side redirect.
  // For now, only gate by presence of a simple flag; the client will also guard.
  const hasSession = req.cookies.get("fb_session")?.value === "1"
  if (!hasSession) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/:path*"],
}


