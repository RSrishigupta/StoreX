import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get('authjs.session-token')?.value 
  console.log("sessionToken",sessionToken);
  
  // console.log(sessionToken);

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
   return NextResponse.next();
}
export const config = {
  matcher: ['/dashboard','/newroute'],
};


