import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import { NDKProvider } from '@libs/ndk/provider';
import { StorageProvider } from '@libs/storage/provider';

import App from './app';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <Toaster position="top-center" closeButton theme="system" />
    <StorageProvider>
      <NDKProvider>
        <App />
      </NDKProvider>
    </StorageProvider>
  </QueryClientProvider>
);
