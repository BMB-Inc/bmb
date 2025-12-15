import { getBaseUrl } from './constants';

export const fetcher = async (url: string, baseUrl?: string, options?: RequestInit) => {
  const apiUrl = getBaseUrl(baseUrl);
  try {
    const response = await fetch(`${apiUrl}${url}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
