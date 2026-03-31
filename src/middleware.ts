import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for these paths
  if (
    pathname === '/login' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for Supabase auth cookies (multiple patterns)
  const cookies = request.cookies.getAll();
  const hasAuth = cookies.some(
    (cookie) =>
      cookie.name.includes('sb-') &&
      (cookie.name.includes('auth-token') || cookie.name.includes('access-token') || cookie.name.includes('refresh-token'))
  );

  if (!hasAuth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
