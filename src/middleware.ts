// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/caja-diaria', '/configuracion', '/pago-proveedores'];
const publicRoutes = ['/login', '/test-api', '/test-proveedores'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);
  const isLoginPage = path === '/login';

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && token) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
