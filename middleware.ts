import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';

const protectedRoutes = ['/'];
const guestRoutes = ['/login'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isGuestRoute = guestRoutes.includes(path);

  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.username) {
    return NextResponse.redirect(new URL(guestRoutes[0], req.nextUrl));
  }

  if (isGuestRoute && session?.username) {
    return NextResponse.redirect(new URL(protectedRoutes[0], req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
