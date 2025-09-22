import { useQuery, useMutation } from '@tanstack/react-query';
import type { ZodSchema } from 'zod';

// Mock data generator
function generateMockData(endpoint: string) {
  const mockData = {
    '/accounts': [
      { id: 1, name: 'Mock Account 1', friendlyName: 'Test Account', type: 1, enabled: true, description: 'Mock account for development' },
      { id: 2, name: 'Mock Account 2', friendlyName: 'Demo Account', type: 2, enabled: false, description: 'Another mock account' }
    ],
    '/users': [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
    ],
    // Add more mock endpoints as needed
  };
  
  return mockData[endpoint] || { message: `Mock data for ${endpoint}`, id: Math.random() };
}

// Mock query function
export function createMockQuery<T>(key: string, endpoint: string, schema: ZodSchema<T>) {
  return () => useQuery({
    queryKey: [key],
    queryFn: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockData = generateMockData(endpoint);
      console.log(`🎭 Mock data for ${endpoint}:`, mockData);
      
      return schema.parse(mockData);
    },
  });
}

// Mock mutation function  
export function createMockMutation<TReq, TRes>(key: string, endpoint: string, schema: ZodSchema<TRes>) {
  return () => useMutation({
    mutationKey: [key],
    mutationFn: async (body: TReq) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log(`🎭 Mock mutation ${endpoint}:`, body);
      
      const mockResponse = { 
        success: true, 
        message: `Mock ${endpoint} operation completed`,
        data: body 
      };
      
      return schema.parse(mockResponse);
    },
  });
}

