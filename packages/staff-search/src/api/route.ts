const SAGITTA_API_URL = 'https://apps.bmbinc.com/api/sagitta';
const SAGITTA_API_URL_STAGING = 'https://staging.bmbinc.com/api/sagitta';

export const getStaff = async (staffCode?: string, staffName?: string, staffId?: number, divisionNo?: string, email?: string, isStaging?: boolean) => {
  // Build query parameters properly
  const params = new URLSearchParams();
  
  if (staffCode) params.append('staffCode', staffCode);
  if (staffName) params.append('staffName', staffName);
  if (staffId) params.append('staffId', staffId.toString());
  if (divisionNo) params.append('divisionNo', divisionNo);
  if (email) params.append('email', email);
  params.append('staffOnly', 'true');
  
  const response = await fetch(`${isStaging ? SAGITTA_API_URL_STAGING : SAGITTA_API_URL}/staff?${params.toString()}`, {
    credentials: 'include',
  });
  const data = await response.json();
  return data;
};


