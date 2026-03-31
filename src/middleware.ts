// Middleware disabled - auth is handled client-side via Supabase JS
// Supabase JS stores tokens in localStorage, not cookies
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
