import { type NextFetchEvent, type NextRequest } from 'next/server';

import { CustomMiddleware } from './chain';
import { I18nMiddleware } from '@/utils/localization/middleware';

export function withLocaleMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = I18nMiddleware(request);
    return middleware(request, event, response);
  };
}
