import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/chat', '/career-hub'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute) {
        // Get the token from cookies
        const token = request.cookies.get('token')?.value;

        // If no token, redirect to login
        if (!token) {
            const loginUrl = new URL('/login', request.url);
            // Add the original URL as a redirect parameter so we can send them back after login
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Allow the request to continue
    return NextResponse.next();
}

// Configure which routes this middleware should run on
export const config = {
    matcher: [

        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
