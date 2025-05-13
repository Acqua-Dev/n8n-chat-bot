'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { lazy, ReactNode, Suspense, useEffect, useState } from 'react';
import { getQueryClient } from '@/utils/query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface StoreProviderProps {
  children: ReactNode;
}

const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);

export default function StoreProvider({ children }: StoreProviderProps) {
  const [showDevtools, setShowDevtools] = useState(false);
  const queryClient = getQueryClient();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
