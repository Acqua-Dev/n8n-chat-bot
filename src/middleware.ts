import { withLocaleMiddleware } from '@/middlewares/with-locale-middleware';
import { chain } from '@/middlewares/chain';

export default chain([withLocaleMiddleware]);

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
};
