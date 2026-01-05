import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { SelectedPagesProvider } from '@hooks/useSelectedPages.tsx';
import { SelectedDocumentsProvider } from '@hooks/useSelectedDocuments.tsx';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { AuthProvider } from '@bmb-inc/auth-context';

const queryClient = new QueryClient()

// Use relative URL to work on staging.bmbinc.com/dev
const AUTH_URL = '/api/auth';
const REDIRECT_URL = window.location.origin + window.location.pathname;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider authUrl={AUTH_URL} redirectUrl={REDIRECT_URL}>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <NuqsAdapter>
          <SelectedDocumentsProvider>
            <SelectedPagesProvider>
              <App />
            </SelectedPagesProvider>
          </SelectedDocumentsProvider>
        </NuqsAdapter>
      </MantineProvider>
    </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
