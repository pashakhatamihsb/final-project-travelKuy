// src/middleware.js
import {NextResponse} from "next/server";

export async function middleware(request) {
    const token = request.cookies.get("token")?.value;
    const {pathname, searchParams} = request.nextUrl;

    // Routes that require authentication
    const protectedRoutes = ["/profile", "/cart", "/booking"];
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Check if this is an activity detail page
    const isActivityPage = pathname.match(/^\/activities\/[^\/]+$/);

    // If user is not authenticated and trying to access protected routes
    if (!token && isProtectedRoute) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname + request.nextUrl.search);

        // Special handling for cart access
        if (pathname.startsWith("/cart")) {
            loginUrl.searchParams.set("login_intent", "cart_access");
        }

        return NextResponse.redirect(loginUrl);
    }

    // For activity pages, pass auth status through headers
    if (isActivityPage) {
        const response = NextResponse.next();
        response.headers.set("x-user-authenticated", token ? "true" : "false");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/cart/:path*",
        "/booking/:path*",
        "/activities/:id*",
    ],
};