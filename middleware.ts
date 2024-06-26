import type { NextRequest } from 'next/server';

import { getIronSession } from 'iron-session';
import { NextResponse } from 'next/server';
import { SessionData, sessionOptions } from './lib/server/session';

export async function middleware(req: NextRequest) {
  const session = await getIronSession<SessionData>(req, NextResponse.next(), sessionOptions);

  if (req.nextUrl.pathname.startsWith('/create-account') || req.nextUrl.pathname.startsWith('/log-in')) {
    if (session.user) {
      return NextResponse.redirect(new URL('/', req.url));
    } else {
      return NextResponse.next();
    }
  }

  if (!session.user && !req.nextUrl.pathname.startsWith('/log-in')) {
    return NextResponse.redirect(new URL('/log-in', req.url));
  }
}
export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)']
};
