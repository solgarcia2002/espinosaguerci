// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith('/admin');
  const isLoginPage = path === '/login';
  const isRoot = path === '/';

  // 🔐 Redirige al login solo si intenta acceder a /admin sin token
  if (isAdminRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // ⛔ No redirigir nada si está en /
  if (isRoot) {
    return NextResponse.next();
  }

  // 🔁 Si ya está logueado y entra a /login, redirige a dashboard
  if (isLoginPage && token) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Aplica solo a estas rutas
export const config = {
  matcher: ['/admin/:path*', '/login'], // Ojo: '/' no está incluido
};
