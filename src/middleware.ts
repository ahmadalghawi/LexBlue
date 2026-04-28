import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// NOTE: Firebase Auth stores tokens in localStorage/IndexedDB — NOT in cookies.
// Server-side middleware cannot read Firebase Auth state directly.
// Route protection is handled client-side by AuthGuard.tsx.
// This middleware only handles public asset/API routing.

export function middleware(request: NextRequest) {
  // No server-side auth check here — Firebase tokens are not accessible in middleware.
  // AuthGuard component handles all client-side route protection.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/learn/:path*', '/admin/:path*'],
};
