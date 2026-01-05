import { createContext, useContext, type ReactNode } from 'react';
import { DEFAULT_BASE_URL, getBaseUrl } from '../api/constants';

export interface ImageRightConfig {
  baseUrl: string;
}

const ImageRightContext = createContext<ImageRightConfig>({
  baseUrl: DEFAULT_BASE_URL,
});

export interface ImageRightProviderProps {
  baseUrl?: string;
  children: ReactNode;
}

export function ImageRightProvider({ baseUrl, children }: ImageRightProviderProps) {
  // Use getBaseUrl() to automatically select proxy URL in dev, staging in prod
  const effectiveBaseUrl = getBaseUrl(baseUrl);
  
  return (
    <ImageRightContext.Provider value={{ baseUrl: effectiveBaseUrl }}>
      {children}
    </ImageRightContext.Provider>
  );
}

export function useImageRightConfig(): ImageRightConfig {
  return useContext(ImageRightContext);
}

export { DEFAULT_BASE_URL };
