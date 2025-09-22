import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

// Test schema
const TestSchema = z.object({
  message: z.string(),
});

// Our actual createQuery pattern but without auth logic
export function createQueryNoAuth<T>(key: string, endpoint: string, schema: z.ZodSchema<T>) {
  return () => useQuery({
    queryKey: [key],
    queryFn: async () => {
      try {
        console.log('Testing endpoint:', endpoint);
        
        // Simple fetch without auth headers
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/1`); // Use a real API for testing
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        
        // Mock the expected structure for our schema
        const mockData = { message: `Real fetch success from ${endpoint}` };
        return schema.parse(mockData);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('An unexpected error occurred');
      }
    },
  });
}

export const useRealQueryTest = createQueryNoAuth('real-test', '/test', TestSchema);
