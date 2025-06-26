import { createCipheriv, createDecipheriv } from "crypto";
import { EncryptedData, AESOptions, EncryptionError } from "./types";
import { CryptoUtils } from "./utils";

export class AESCrypto {
  private readonly algorithm: string;
  private readonly keyDerivation: string;
  private readonly iterations: number;

  constructor(options: AESOptions = {}) {
    this.algorithm = options.algorithm || "aes-256-cbc";
    this.keyDerivation = options.keyDerivation || "pbkdf2";
    this.iterations = options.iterations || 100000;
  }

  /**
   * Encrypt plaintext using AES with automatic IV generation
   * Recommended for server-level sensitive data
   */
  encrypt(plaintext: string, password: string): EncryptedData {
    try {
      // Generate salt and IV (algorithm-specific)
      const salt = CryptoUtils.generateSalt();
      // amazonq-ignore-next-line
      const iv = CryptoUtils.generateIVForAlgorithm(this.algorithm);

      // Derive key from password
      const key = CryptoUtils.deriveKeyForEncryption(
        password,
        salt,
        this.iterations
      );

      // Create cipher
      const cipher = createCipheriv(this.algorithm, key, iv);

      // Encrypt data
      let encrypted = cipher.update(plaintext, "utf8", "hex");
      encrypted += cipher.final("hex");

      return {
        encrypted: `${salt}:${encrypted}`,
        iv: iv.toString("hex"),
      };
    } catch (error) {
      throw this.createError("ENCRYPTION_FAILED", "encrypt", error);
    }
  }

  /**
   * Decrypt ciphertext using AES
   */
  decrypt(ciphertext: string, password: string, ivHex: string): string {
    try {
      // Parse salt and encrypted data
      const [salt, encrypted] = ciphertext.split(":");
      if (!salt || !encrypted) {
        throw new Error("Invalid ciphertext format");
      }

      // Convert IV from hex
      const iv = Buffer.from(ivHex, "hex");

      // Derive key from password
      const key = CryptoUtils.deriveKeyForEncryption(
        password,
        salt,
        this.iterations
      );

      // Create decipher
      const decipher = createDecipheriv(this.algorithm, key, iv);

      // Decrypt data
      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      throw this.createError("DECRYPTION_FAILED", "decrypt", error);
    }
  }

  /**
   * Encrypt an object by serializing it to JSON first
   * Useful for encrypting complex server data structures
   */
  encryptObject(obj: any, password: string): EncryptedData {
    try {
      const jsonString = JSON.stringify(obj);
      return this.encrypt(jsonString, password);
    } catch (error) {
      throw this.createError(
        "OBJECT_ENCRYPTION_FAILED",
        "encryptObject",
        error
      );
    }
  }

  /**
   * Decrypt an object by deserializing from JSON
   */
  decryptObject<T = any>(encrypted: EncryptedData, password: string): T {
    try {
      const jsonString = this.decrypt(
        encrypted.encrypted,
        password,
        encrypted.iv
      );
      return JSON.parse(jsonString);
    } catch (error) {
      throw this.createError(
        "OBJECT_DECRYPTION_FAILED",
        "decryptObject",
        error
      );
    }
  }

  /**
   * Encrypt multiple fields in an object while preserving structure
   * Useful for selective encryption of sensitive database fields
   */
  encryptFields(
    obj: Record<string, any>,
    fieldsToEncrypt: string[],
    password: string
  ): Record<string, any> {
    try {
      const result = { ...obj };

      for (const field of fieldsToEncrypt) {
        if (obj[field] !== undefined && obj[field] !== null) {
          const encrypted = this.encrypt(String(obj[field]), password);
          result[field] = `encrypted:${encrypted.encrypted}:${encrypted.iv}`;
        }
      }

      return result;
    } catch (error) {
      throw this.createError("FIELD_ENCRYPTION_FAILED", "encryptFields", error);
    }
  }

  /**
   * Decrypt multiple fields in an object
   */
  decryptFields(
    obj: Record<string, any>,
    fieldsToDecrypt: string[],
    password: string
  ): Record<string, any> {
    try {
      const result = { ...obj };

      for (const field of fieldsToDecrypt) {
        if (
          obj[field] &&
          typeof obj[field] === "string" &&
          obj[field].startsWith("encrypted:")
        ) {
          const parts = obj[field].split(":");
          if (parts.length === 3) {
            const [, encrypted, iv] = parts;
            result[field] = this.decrypt(encrypted, password, iv);
          }
        }
      }

      return result;
    } catch (error) {
      throw this.createError("FIELD_DECRYPTION_FAILED", "decryptFields", error);
    }
  }

  /**
   * Encrypt data with authentication (using AES-GCM for authenticated encryption)
   */
  encryptAuthenticated(
    plaintext: string,
    password: string,
    additionalData?: string
  ): EncryptedData & { authTag: string } {
    try {
      if (this.algorithm !== "aes-256-gcm") {
        throw new Error("Authenticated encryption requires AES-GCM algorithm");
      }

      const salt = CryptoUtils.generateSalt();
      const iv = CryptoUtils.generateIVForAlgorithm("aes-256-gcm"); // 12-byte IV for GCM
      const key = CryptoUtils.deriveKeyForEncryption(
        password,
        salt,
        this.iterations
      );

      const cipher = createCipheriv("aes-256-gcm", key, iv);

      if (additionalData) {
        cipher.setAAD(Buffer.from(additionalData, "utf8"));
      }

      let encrypted = cipher.update(plaintext, "utf8", "hex");
      encrypted += cipher.final("hex");

      const authTag = cipher.getAuthTag();

      return {
        encrypted: `${salt}:${encrypted}`,
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex"),
      };
    } catch (error) {
      throw this.createError(
        "AUTHENTICATED_ENCRYPTION_FAILED",
        "encryptAuthenticated",
        error
      );
    }
  }

  /**
   * Decrypt authenticated data (using AES-GCM with authentication verification)
   */
  decryptAuthenticated(
    ciphertext: string,
    password: string,
    ivHex: string,
    authTagHex: string,
    additionalData?: string
  ): string {
    try {
      if (this.algorithm !== "aes-256-gcm") {
        throw new Error("Authenticated decryption requires AES-GCM algorithm");
      }

      const [salt, encrypted] = ciphertext.split(":");
      if (!salt || !encrypted) {
        throw new Error("Invalid ciphertext format");
      }

      const iv = Buffer.from(ivHex, "hex");
      const authTag = Buffer.from(authTagHex, "hex");
      const key = CryptoUtils.deriveKeyForEncryption(
        password,
        salt,
        this.iterations
      );

      const decipher = createDecipheriv("aes-256-gcm", key, iv);
      decipher.setAuthTag(authTag);

      if (additionalData) {
        decipher.setAAD(Buffer.from(additionalData, "utf8"));
      }

      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      throw this.createError(
        "AUTHENTICATED_DECRYPTION_FAILED",
        "decryptAuthenticated",
        error
      );
    }
  }

  /**
   * Create standardized encryption error
   */
  private createError(
    code: string,
    operation: string,
    originalError?: any
  ): EncryptionError {
    const error = new Error(
      `AES operation failed: ${operation}`
    ) as EncryptionError;
    error.code = code;
    error.operation = operation;
    if (originalError) {
      error.cause = originalError;
    }
    return error;
  }
}
