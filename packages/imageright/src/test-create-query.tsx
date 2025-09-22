import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// Simple schema for testing
const TestSchema = z.object({
  message: z.string(),
});

// Simplified createQuery without auth or complex logic
export function createSimpleQuery<T>(key: string, endpoint: string, schema: z.ZodSchema<T>) {
  return () => useQuery({
    queryKey: [key],
    queryFn: async () => {
      console.log('Testing endpoint:', endpoint);
      // Simple mock data instead of real fetch
      const mockData = { message: `Mock data from ${endpoint}` };
      return schema.parse(mockData);
    },
  });
}

export const useSimpleTest = createSimpleQuery('simple-test', '/test', TestSchema);
