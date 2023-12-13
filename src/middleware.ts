import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import Verification from './app/verification/page';
import { NextURL } from 'next/dist/server/web/next-url';
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const PublicPath = path === '/signup' || path === '/login' || path === '/forget';
    const RestrictedPath = path === '/verification' || path === '/reset';

    if(PublicPath){
      const token = request.cookies.get('token')?.value || '';
      if(token){
        return NextResponse.redirect(new URL('/profile', request.nextUrl));
      }
      else if(!token){
        return NextResponse.redirect(new URL('/login', request.nextUrl));
      }
    }

    if(RestrictedPath){
      const forgetToken = request.cookies.get('forgetToken')?.value || '';
      if(forgetToken){
        return console.log('The path is restricted and has forgettoken');
      }
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
  ]
}