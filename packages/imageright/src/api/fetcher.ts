const IMAGERIGHT_API_URL = (import.meta as any).env.VITE_IMAGERIGHT_API_URL;

export const fetcher = async (url: string, options?: RequestInit) => {
  try {
  const response = await fetch(`${IMAGERIGHT_API_URL}${url}`, options);
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