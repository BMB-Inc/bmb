// Development mode - bypass authentication for testing
const isDevelopment = import.meta.env.DEV;

export function createDevQuery<T>(key: string, endpoint: string, schema: any) {
  return () => {
    if (isDevelopment) {
      // Mock successful response for development
      return {
        data: { message: `Mock data for ${endpoint}`, name: 'Mock Account' },
        isLoading: false,
        error: null,
      };
    }
    // Use real query in production
    return { data: null, isLoading: true, error: null };
  };
}

