import {NextResponse,type NextRequest} from 'next/server';
export function middleware(req:NextRequest){const headers=new Headers(req.headers);headers.set('x-joya-locale',req.nextUrl.pathname.startsWith('/ar')?'ar':'en');return NextResponse.next({request:{headers}});}
export const config={matcher:['/((?!api|_next/static|_next/image|photography|icon.svg).*)']};
