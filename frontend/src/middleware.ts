import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/lib/config/constants';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(env.AUTH_TOKEN)?.value;
  const role = request.cookies.get('user_role')?.value; 

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // 1. Public Routes: Allow access, but redirect logged-in users
  if (pathname === '/' || pathname.startsWith('/apply') || pathname.startsWith('/login')) {
    if (token && role) {
      if (role === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if (role === 'STUDENT') {
        return NextResponse.redirect(new URL('/student/dashboard', request.url));
      }
    }
    // Allow access to public pages if not logged in (or partial login)
    return NextResponse.next();
  }

  // 2. Authentication Check: If no token OR no role, force login
  // This prevents the loop where a token exists but role is missing
  if (!token || !role) {
    const loginUrl = new URL('/login', request.url);
    // Optional: You might want to delete the invalid token cookie here
    const response = NextResponse.redirect(loginUrl);
    if (!token) response.cookies.delete(env.AUTH_TOKEN);
    if (!role) response.cookies.delete('user_role');
    return response;
  }

  // 3. Role-Based Authorization
  
  // Protect Admin Routes
  if (pathname.startsWith('/dashboard')) {
    if (role !== 'ADMIN') {
      // If they are strictly a student, send them to student dash
      if (role === 'STUDENT') {
        return NextResponse.redirect(new URL('/student/dashboard', request.url));
      }
      // Otherwise, they don't belong here -> Login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect Student Routes
  if (pathname.startsWith('/student')) {
    // Allow ADMIN to access student routes if necessary, otherwise strict check
    if (role !== 'STUDENT' && role !== 'ADMIN') { 
        if (role === 'ADMIN') {
             return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};