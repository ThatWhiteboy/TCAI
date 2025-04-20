import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import type { AppRouter } from '../server/api';

export const trpc = createTRPCReact<AppRouter>();

export function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${import.meta.env.VITE_APP_URL}/api/trpc`,
        // Include credentials for authenticated requests
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
          });
        },
      }),
    ],
  });
}