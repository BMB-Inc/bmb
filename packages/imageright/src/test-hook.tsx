import { useQuery } from '@tanstack/react-query';

// Test our hook factory pattern in isolation
export function createTestQuery() {
  return () => useQuery({
    queryKey: ['test-factory'],
    queryFn: async () => {
      return { message: 'Hello from hook factory!' };
    },
  });
}

export const useTestQuery = createTestQuery();
