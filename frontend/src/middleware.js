import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  console.log('Middleware - Token:', token);
  console.log('Middleware - Path:', pathname);

  const isProtectedPath =
    pathname.startsWith('/create-post') ||
    pathname.startsWith('/own-profile') ||
    pathname.startsWith('/post-detail');

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/create-post', '/own-profile', '/post-detail/:path*'],
};
