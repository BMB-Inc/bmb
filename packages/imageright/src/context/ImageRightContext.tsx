import { createContext, useContext, type ReactNode } from 'react';
import { DEFAULT_BASE_URL } from '../api/constants';

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

export function ImageRightProvider({ baseUrl = DEFAULT_BASE_URL, children }: ImageRightProviderProps) {
  return (
    <ImageRightContext.Provider value={{ baseUrl }}>
      {children}
    </ImageRightContext.Provider>
  );
}

export function useImageRightConfig(): ImageRightConfig {
  return useContext(ImageRightContext);
}

export { DEFAULT_BASE_URL };
