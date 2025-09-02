// Default API URL that can be overridden
const DEFAULT_API_URL = 'https://apps.bmbinc.com/api/sagitta';

export const getStaff = async (staffCode?: string, staffName?: string, staffId?: number, divisionNo?: string, email?: string, baseUrl?: string) => {
  // Build query parameters properly
  const params = new URLSearchParams();
  
  if (staffCode) params.append('staffCode', staffCode);
  if (staffName) params.append('staffName', staffName);
  if (staffId) params.append('staffId', staffId.toString());
  if (divisionNo) params.append('divisionNo', divisionNo);
  if (email) params.append('email', email);
  params.append('staffOnly', 'true');
  
  const response = await fetch(`${baseUrl || DEFAULT_API_URL}/staff?${params.toString()}`, {
    credentials: 'include',
  });
  const data = await response.json();
  return data;
};


