/// <reference types="vite/client" />

// Add explicit type definitions for our environment variables
interface ImportMetaEnv {
  readonly VITE_SAGITTA_CLIENTS_URL: string;
  // Add other env vars as needed
}

// Extend the existing ImportMeta interface
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
