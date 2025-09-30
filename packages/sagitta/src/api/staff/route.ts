// Default API URL that can be overridden
const DEFAULT_API_URL = (import.meta as any).env.VITE_API_URL;
// const API_KEY = (import.meta as any).env.VITE_SAGITTA_API_KEY || '12345';


export const getStaff = async (staffCode?: string, staffName?: string, email?: string, baseUrl?: string) => {
  // Build query parameters properly
  const params = new URLSearchParams();
  
  if (staffCode) params.append('staffCode', staffCode);
  if (staffName) params.append('staffName', staffName);
  if (email) params.append('email', email);
  params.append('staffOnly', 'true');
  
  const response = await fetch(`${baseUrl || DEFAULT_API_URL}/staff?${params.toString()}`, {
    credentials: 'include',
    // headers: {
    //   'x-api-key': API_KEY
    // }
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};


