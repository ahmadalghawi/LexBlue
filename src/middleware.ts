import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('firebaseAuthToken')?.value;
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/learn');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // If user is trying to access a protected route without a token (Client side logic will handle precise checks, this is rudimentary)
  if (!currentUser && (isProtectedRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in and trying to access login/register
  if (currentUser && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/learn/:path*', '/admin/:path*', '/login', '/register'],
};
