import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { SelectedPagesProvider } from '@hooks/useSelectedPages.tsx';
import { NuqsAdapter } from 'nuqs/adapters/react';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <NuqsAdapter>
          <SelectedPagesProvider>
            <App />
          </SelectedPagesProvider>
        </NuqsAdapter>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
)
