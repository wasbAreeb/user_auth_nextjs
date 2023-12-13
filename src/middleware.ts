import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isPublicPath = path === '/signup' || path === '/login' || path === '/forget' || (path === '/verification' && request.nextUrl.searchParams.has('token'));
    const isRestrictedPath = (path === '/verification' && request.nextUrl.searchParams.has('resetToken')) || path === '/reset';

    const token = request.cookies.get('token')?.value || '';
    const forgetToken = request.cookies.get('forgetToken')?.value || '';

    if (token && isPublicPath){
      return NextResponse.redirect(new URL('/profile', request.url));
    }
    else if (!token && (path === '/profile')){
      return NextResponse.redirect(new URL('/login', request.url));
    }
    else if(isRestrictedPath && !forgetToken && !token){
      return NextResponse.redirect(new URL('/login', request.url));
    }
    else if(isRestrictedPath && !forgetToken && token){
      return NextResponse.redirect(new URL('/profile', request.url));
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup',  
    '/verification',
    '/reset',
    '/forget'
  ]
}
