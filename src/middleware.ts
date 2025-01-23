import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protéger les routes du dashboard
  if (pathname.startsWith('/dashboard')) {
    const userToken = request.cookies.get('userToken')?.value;
    if (!userToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protéger les routes admin
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminToken = request.cookies.get('adminToken')?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}; 