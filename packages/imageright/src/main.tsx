import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import '@mantine/core/styles.css';
import { SelectedPagesProvider } from '@hooks/useSelectedPages.tsx';

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <BrowserRouter>
          <SelectedPagesProvider>
            <App />
          </SelectedPagesProvider>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
)
