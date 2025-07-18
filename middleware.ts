import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
    const token = await getToken({ req })
    const { pathname } = req.nextUrl

    // 🔐 Block access to dashboard/profile if not authenticated
    const protectedRoutes = ["/dashboard", "/entries/new", "/profile"]


    if (protectedRoutes.includes(pathname)) {
        if (!token) {
            const loginUrl = new URL("/login", req.url)
            return NextResponse.redirect(loginUrl)
        }
    }

    // 🚫 Redirect logged-in users away from /login
    if (pathname === "/login" && token) {
        const dashboardUrl = new URL("/dashboard", req.url)
        return NextResponse.redirect(dashboardUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard", "/login"],
}
