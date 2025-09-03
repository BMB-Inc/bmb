import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider>
        <QueryClientProvider client={queryClient}>    
          <App />
        </QueryClientProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>,
)
