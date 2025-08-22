const SAGITTA_API_URL = 'https://staging.bmbinc.com/api/sagitta';

export const getClientById = async (clientId: string) => {
  if (!clientId) return null;
  
  try {
    const apiUrl = `${SAGITTA_API_URL}/clients?client_id=${encodeURIComponent(clientId)}`;
    const result = await fetch(apiUrl);
    
    if (!result.ok) {
      throw new Error(`API error: ${result.status} ${result.statusText}`);
    }
    
    const response = await result.json();
    // API returns an array, so we return the array directly
    // The component will handle extracting the first client
    return response;
  } catch (error) {
    console.error("Error fetching client by ID:", error);
    return null;
  }
};

export const getClients = async (client_name: string) => {
  if (!client_name) {
    return [];
  }
  
  try {
    const apiUrl = `${SAGITTA_API_URL}/clients?client_name=${encodeURIComponent(client_name)}`;
    const result = await fetch(apiUrl, {
      credentials: 'include',
    });
    
    if (!result.ok) {
      throw new Error(`API error: ${result.status} ${result.statusText}`);
    }
    
    const responseData = await result.json();
    
    // Check if responseData is an array
    if (!Array.isArray(responseData)) {
      // If it's an object with a data property that's an array, use that
      if (responseData && Array.isArray(responseData.data)) {
        return responseData.data;
      }
      
      // If it's a single object, wrap it in an array
      if (responseData && typeof responseData === 'object') {
        // If it looks like a client object, wrap it
        if (responseData.CLIENTS_ID || responseData.CLIENTNAME) {
          return [responseData];
        }
        
        // Return an empty array as fallback
        return [];
      }
      
      // Return empty array as fallback
      return [];
    }
    
    return responseData;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}