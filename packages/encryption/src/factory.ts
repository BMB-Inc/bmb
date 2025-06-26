import { AESCrypto } from "./aes";
import { RSACrypto } from "./rsa";
import { PasswordCrypto } from "./password";
import { AESOptions, RSAOptions, PasswordHashOptions } from "./types";

/**
 * Factory function to create encryption instances with common configurations
 */
export function createEncryption(type: "server-aes"): AESCrypto;
export function createEncryption(type: "server-aes-gcm"): AESCrypto;
export function createEncryption(type: "rsa-2048"): RSACrypto;
export function createEncryption(type: "rsa-4096"): RSACrypto;
export function createEncryption(type: "password-strong"): PasswordCrypto;
export function createEncryption(type: "password-fast"): PasswordCrypto;
export function createEncryption(
  type: string
): AESCrypto | RSACrypto | PasswordCrypto {
  switch (type) {
    case "server-aes":
      return new AESCrypto({
        algorithm: "aes-256-cbc",
        keyDerivation: "pbkdf2",
        iterations: 100000,
      });

    case "server-aes-gcm":
      return new AESCrypto({
        algorithm: "aes-256-gcm",
        keyDerivation: "pbkdf2",
        iterations: 100000,
      });

    case "rsa-2048":
      return new RSACrypto({
        keySize: 2048,
        publicExponent: 65537,
      });

    case "rsa-4096":
      return new RSACrypto({
        keySize: 4096,
        publicExponent: 65537,
      });

    case "password-strong":
      return new PasswordCrypto({
        algorithm: "pbkdf2",
        saltRounds: 100000,
      });

    case "password-fast":
      return new PasswordCrypto({
        algorithm: "pbkdf2",
        saltRounds: 50000,
      });

    default:
      throw new Error(`Unknown encryption type: ${type}`);
  }
}

/**
 * Create a complete encryption suite for server applications
 */
export function createServerEncryptionSuite() {
  return {
    aes: createEncryption("server-aes"),
    aesGcm: createEncryption("server-aes-gcm"),
    rsa: createEncryption("rsa-2048"),
    password: createEncryption("password-strong"),
  };
}

/**
 * Create encryption suite optimized for performance
 */
export function createFastEncryptionSuite() {
  return {
    aes: createEncryption("server-aes"),
    rsa: createEncryption("rsa-2048"),
    password: createEncryption("password-fast"),
  };
}

/**
 * Create encryption suite optimized for maximum security
 */
export function createHighSecuritySuite() {
  return {
    aes: createEncryption("server-aes-gcm"),
    rsa: createEncryption("rsa-4096"),
    password: createEncryption("password-strong"),
  };
}
