import { createQuery } from '@api/fetcher';
import { createMockQuery } from '@api/mock-mode';
import { AccountSchema } from '@schemas/accounts/account.schema';

// Use mock mode in development, real API in production
const useMockMode = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true';

export const useGetAccounts = useMockMode 
  ? createMockQuery('accounts', '/accounts', AccountSchema)
  : createQuery('accounts', '/accounts', AccountSchema);
