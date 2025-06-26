export interface EncryptedData {
  encrypted: string;
  iv: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface HashOptions {
  algorithm?: "sha256" | "sha512" | "md5";
  encoding?: "hex" | "base64";
}

export interface PasswordHashOptions {
  saltRounds?: number;
  algorithm?: "pbkdf2" | "scrypt" | "argon2";
}

export interface RSAOptions {
  keySize?: number;
  publicExponent?: number;
}

export interface AESOptions {
  algorithm?: "aes-256-cbc" | "aes-256-gcm" | "aes-192-cbc" | "aes-128-cbc";
  keyDerivation?: "pbkdf2" | "scrypt";
  iterations?: number;
}

export interface EncryptionError extends Error {
  code: string;
  operation: string;
  cause?: any;
}
