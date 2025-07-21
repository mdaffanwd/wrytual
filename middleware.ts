import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    // Routes that need auth
    const protectedRoutes = ["/dashboard", "/entries", "/entries/new"];

    // Is this route protected?
    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Not signed in? Redirect to login.
    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // 👋 Already signed in? Redirect away from login page.
    if (pathname === "/login" && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        "/dashboard",
        "/entries",
        "/entries/:path*",
        "/entries/new",
        "/login"
    ],
}
