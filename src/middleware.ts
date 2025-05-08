import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get('authjs.session-token')?.value 
  
  // console.log(sessionToken);

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
   return NextResponse.next();
}
export const config = {
  matcher: ['/dashboard','/newroute'],
};




//////////////////////////////////////////////////////////////////////////////
// export { auth as middleware } from "@/auth"
// import { auth } from "@/auth"
// export default auth((req) => {
//   if (!req.auth && req.nextUrl.pathname !== "/login") {
//     const newUrl = new URL("/login", req.nextUrl.origin)
//     return Response.redirect(newUrl)
//   }
// })
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// }
// // middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// export async function middleware(req: NextRequest) {
//     const { pathname } = req.nextUrl;
//     const publicRoutes = ['/login'];
//     if (publicRoutes.includes(pathname)) {
//         console.log(pathname);
//         return NextResponse.next();
//     }
//     const sessionToken = req.cookies.get('authjs.session-token')?.value;
//     console.log(sessionToken);

//     if (!sessionToken) {
//         return NextResponse.redirect(new URL('/login', req.url));
//     }
// }