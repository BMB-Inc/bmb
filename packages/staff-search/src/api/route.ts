const SAGITTA_API_URL = 'https://apps.bmbinc.com/api/sagitta';
const API_KEY = import.meta.env.VITE_SAGITTA_API_KEY;

export const getStaff = async (staffCode?: string, staffName?: string, staffId?: number, divisionNo?: string, email?: string) => {
  // Build query parameters properly
  const params = new URLSearchParams();
  
  if (staffCode) params.append('staffCode', staffCode);
  if (staffName) params.append('staffName', staffName);
  if (staffId) params.append('staffId', staffId.toString());
  if (divisionNo) params.append('divisionNo', divisionNo);
  if (email) params.append('email', email);
  params.append('staffOnly', 'true');
  
  const response = await fetch(`${SAGITTA_API_URL}/staff?${params.toString()}`, {
    headers: {
      'x-api-key': API_KEY,
    },
  });
  const data = await response.json();
  return data;
};


