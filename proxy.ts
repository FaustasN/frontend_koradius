import createMiddleware from 'next-intl/middleware';
import {NextRequest, NextResponse} from 'next/server';
import {routing} from './i18n/routing';

const intlProxy = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ❗ admin neina per locale
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  return intlProxy(request);
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
};