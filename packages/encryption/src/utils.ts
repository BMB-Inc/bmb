import { createHash, randomBytes } from "crypto";
import argon2 from "argon2";
import bcrypt from "bcrypt";
import { HashOptions, EncryptionError } from "./types";

/**
 * Modern cryptographic utilities using industry-standard libraries
 * Following NIST SP 800-132 and NYDFS compliance requirements
 *
 * Primary: Argon2id (2015 Password Hashing Competition winner)
 * Fallback: bcrypt (battle-tested, widely adopted)
 * Utilities: Node.js crypto (for non-password operations)
 */
export class CryptoUtils {
  /**
   * Generate a cryptographically secure random key
   */
  static generateRandomKey(length: number = 32): string {
    try {
      if (typeof randomBytes !== "function") {
        throw new Error("Secure random number generator not available");
      }
      const buffer = randomBytes(length);
      if (buffer.length !== length) {
        throw new Error("Insufficient random bytes generated");
      }
      return buffer.toString("hex");
    } catch (error) {
      throw this.createError(
        "KEY_GENERATION_FAILED",
        "generateRandomKey",
        error
      );
    }
  }

  /**
   * Generate a cryptographically secure salt
   * NIST SP 800-132 Compliance: Minimum 128 bits (16 bytes)
   */
  static generateSalt(length: number = 16): string {
    if (length < 16) {
      throw this.createError(
        "INSUFFICIENT_SALT_LENGTH",
        "generateSalt",
        new Error(
          "Salt must be at least 128 bits (16 bytes) per NIST SP 800-132"
        )
      );
    }

    try {
      return randomBytes(length).toString("hex");
    } catch (error) {
      throw this.createError("SALT_GENERATION_FAILED", "generateSalt", error);
    }
  }

  /**
   * Hash password using Argon2id (recommended)
   *
   * Argon2id Configuration (OWASP 2024 recommendations):
   * - Memory: 19 MiB minimum
   * - Iterations: 2 minimum
   * - Parallelism: 1
   * - Hash length: 32 bytes
   *
   * @param password - Password to hash
   * @param options - Optional Argon2 configuration
   * @returns Promise<string> - Encoded hash string
   */
  static async hashPassword(
    password: string,
    options?: {
      memoryCost?: number; // Memory in KiB (default: 19456 = 19 MiB)
      timeCost?: number; // Iterations (default: 2)
      parallelism?: number; // Threads (default: 1)
      hashLength?: number; // Output length (default: 32)
    }
  ): Promise<string> {
    // Validate password strength first
    const validation = this.validatePasswordStrength(password);
    if (!validation.isValid) {
      throw this.createError(
        "WEAK_PASSWORD",
        "hashPassword",
        new Error(
          `Password validation failed: ${validation.recommendations.join(", ")}`
        )
      );
    }

    const config = {
      memoryCost: options?.memoryCost || 19456, // 19 MiB (OWASP recommended)
      timeCost: options?.timeCost || 2, // 2 iterations
      parallelism: options?.parallelism || 1, // 1 thread
      hashLength: options?.hashLength || 32, // 32 bytes output
      type: argon2.argon2id, // Use Argon2id variant
    };

    try {
      return await argon2.hash(password, config);
    } catch (error) {
      throw this.createError("PASSWORD_HASH_FAILED", "hashPassword", error);
    }
  }

  /**
   * Verify password against Argon2 hash
   *
   * @param password - Plain text password
   * @param hash - Argon2 encoded hash
   * @returns Promise<boolean> - Verification result
   */
  static async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      throw this.createError("PASSWORD_VERIFY_FAILED", "verifyPassword", error);
    }
  }

  /**
   * Hash password using bcrypt (fallback/legacy support)
   *
   * @param password - Password to hash
   * @param rounds - Cost factor (default: 12, min: 10 for NYDFS)
   * @returns Promise<string> - bcrypt hash
   */
  static async hashPasswordBcrypt(
    password: string,
    rounds: number = 12
  ): Promise<string> {
    if (rounds < 10) {
      throw this.createError(
        "INSUFFICIENT_ROUNDS",
        "hashPasswordBcrypt",
        new Error("Minimum 10 rounds required for NYDFS compliance")
      );
    }

    if (password.length > 72) {
      throw this.createError(
        "PASSWORD_TOO_LONG",
        "hashPasswordBcrypt",
        new Error("bcrypt has 72 byte password limit")
      );
    }

    // Validate password strength
    const validation = this.validatePasswordStrength(password);
    if (!validation.isValid) {
      throw this.createError(
        "WEAK_PASSWORD",
        "hashPasswordBcrypt",
        new Error(
          `Password validation failed: ${validation.recommendations.join(", ")}`
        )
      );
    }

    try {
      return await bcrypt.hash(password, rounds);
    } catch (error) {
      throw this.createError("BCRYPT_HASH_FAILED", "hashPasswordBcrypt", error);
    }
  }

  /**
   * Verify password against bcrypt hash
   *
   * @param password - Plain text password
   * @param hash - bcrypt hash
   * @returns Promise<boolean> - Verification result
   */
  static async verifyPasswordBcrypt(
    password: string,
    hash: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw this.createError(
        "BCRYPT_VERIFY_FAILED",
        "verifyPasswordBcrypt",
        error
      );
    }
  }

  /**
   * Universal password verification - auto-detects hash type
   *
   * @param password - Plain text password
   * @param hash - Hash to verify against
   * @returns Promise<boolean> - Verification result
   */
  static async verifyPasswordUniversal(
    password: string,
    hash: string
  ): Promise<boolean> {
    try {
      // Argon2 hashes start with $argon2
      if (hash.startsWith("$argon2")) {
        return await this.verifyPassword(password, hash);
      }

      // bcrypt hashes start with $2a$, $2b$, $2x$, or $2y$
      if (hash.match(/^\$2[abxy]\$/)) {
        return await this.verifyPasswordBcrypt(password, hash);
      }

      throw new Error("Unsupported hash format");
    } catch (error) {
      throw this.createError(
        "UNIVERSAL_VERIFY_FAILED",
        "verifyPasswordUniversal",
        error
      );
    }
  }

  /**
   * Hash data using specified algorithm (for non-password data)
   */
  static hash(data: string, options: HashOptions = {}): string {
    const { algorithm = "sha256", encoding = "hex" } = options;

    try {
      return createHash(algorithm).update(data, "utf8").digest(encoding);
    } catch (error) {
      throw this.createError("HASH_FAILED", "hash", error);
    }
  }

  /**
   * Generate a cryptographically secure random initialization vector (IV)
   *
   * Security Guarantees (CWE-327/347 Compliance):
   * - Uses Node.js crypto.randomBytes (CSPRNG)
   * - Each IV is cryptographically unique and unpredictable
   * - Suitable for all standard cipher modes (CBC, GCM, etc.)
   * - Prevents dictionary attacks and IV reuse vulnerabilities
   *
   * @param length - IV length in bytes (default: 16 for AES-CBC, 12 for GCM)
   * @returns Buffer containing cryptographically secure random IV
   */
  static generateIV(length: number = 16): Buffer {
    // Validate IV length for common algorithms
    if (length < 8) {
      throw this.createError(
        "INSUFFICIENT_IV_LENGTH",
        "generateIV",
        new Error("IV must be at least 8 bytes for cryptographic security")
      );
    }

    if (length > 64) {
      throw this.createError(
        "EXCESSIVE_IV_LENGTH",
        "generateIV",
        new Error("IV length should not exceed 64 bytes")
      );
    }

    try {
      // Use Node.js crypto.randomBytes - CSPRNG (Cryptographically Secure PRNG)
      // This ensures each IV is cryptographically unique and unpredictable
      if (typeof randomBytes !== "function") {
        throw new Error(
          "Cryptographically secure random number generator not available"
        );
      }

      const iv = randomBytes(length);

      // Validate the generated IV
      if (iv.length !== length) {
        throw new Error(
          `Failed to generate IV of requested length: expected ${length}, got ${iv.length}`
        );
      }

      // Additional entropy check - ensure IV is not all zeros (extremely unlikely but security critical)
      const allZeros = Buffer.alloc(length, 0);
      if (iv.equals(allZeros)) {
        throw new Error(
          "Generated IV contains insufficient entropy (all zeros)"
        );
      }

      return iv;
    } catch (error) {
      throw this.createError("IV_GENERATION_FAILED", "generateIV", error);
    }
  }

  /**
   * Generate algorithm-specific initialization vectors with proper lengths
   *
   * @param algorithm - Encryption algorithm ('aes-cbc', 'aes-gcm', 'chacha20-poly1305')
   * @returns Buffer containing properly sized IV for the algorithm
   */
  static generateIVForAlgorithm(algorithm: string): Buffer {
    const algorithmLower = algorithm.toLowerCase();

    // Algorithm-specific IV lengths (NIST recommendations)
    const ivLengths: Record<string, number> = {
      "aes-128-cbc": 16,
      "aes-192-cbc": 16,
      "aes-256-cbc": 16,
      "aes-128-gcm": 12,
      "aes-192-gcm": 12,
      "aes-256-gcm": 12,
      "aes-128-cfb": 16,
      "aes-192-cfb": 16,
      "aes-256-cfb": 16,
      "aes-128-ofb": 16,
      "aes-192-ofb": 16,
      "aes-256-ofb": 16,
      "chacha20-poly1305": 12,
      chacha20: 12,
    };

    const ivLength = ivLengths[algorithmLower];

    if (!ivLength) {
      throw this.createError(
        "UNSUPPORTED_ALGORITHM",
        "generateIVForAlgorithm",
        new Error(`Unsupported or unknown algorithm: ${algorithm}`)
      );
    }

    return this.generateIV(ivLength);
  }

  /**
   * Constant-time string comparison to prevent timing attacks
   */
  static constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  /**
   * Validate password strength for NYDFS compliance
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let score = 0;

    // Minimum length (NYDFS typically requires strong passwords)
    if (password.length < 12) {
      recommendations.push("Use at least 12 characters for enhanced security");
    } else if (password.length >= 16) {
      score += 2;
    } else {
      score += 1;
    }

    // Character variety
    if (!/[a-z]/.test(password)) {
      recommendations.push("Include lowercase letters");
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      recommendations.push("Include uppercase letters");
    } else {
      score += 1;
    }

    if (!/[0-9]/.test(password)) {
      recommendations.push("Include numbers");
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      recommendations.push("Include special characters");
    } else {
      score += 1;
    }

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      recommendations.push("Avoid repeating characters");
      score -= 1;
    }

    if (/123|abc|qwe|password|admin/i.test(password)) {
      recommendations.push("Avoid common patterns and dictionary words");
      score -= 2;
    }

    const isValid = password.length >= 8 && score >= 3;

    return {
      isValid,
      score: Math.max(0, score),
      recommendations,
    };
  }

  /**
   * Validate key strength
   */
  static validateKeyStrength(key: string, minLength: number = 32): boolean {
    if (key.length < minLength) {
      return false;
    }

    // Check for reasonable entropy (not all same character)
    const uniqueChars = new Set(key).size;
    return uniqueChars > key.length * 0.3;
  }

  /**
   * Get hash algorithm information from encoded hash
   *
   * @param hash - Encoded hash string
   * @returns Object with algorithm details
   */
  static getHashInfo(hash: string): {
    algorithm: string;
    version?: string;
    cost?: number;
    memoryCost?: number;
    timeCost?: number;
    parallelism?: number;
  } {
    try {
      // Argon2 format: $argon2id$v=19$m=19456,t=2,p=1$salt$hash
      if (hash.startsWith("$argon2")) {
        const parts = hash.split("$");
        const variant = parts[1]; // argon2id, argon2i, argon2d
        const version = parts[2]; // v=19
        const params = parts[3]; // m=19456,t=2,p=1

        const paramObj: any = { algorithm: variant, version };
        params.split(",").forEach((param) => {
          const [key, value] = param.split("=");
          if (key === "m") paramObj.memoryCost = parseInt(value);
          if (key === "t") paramObj.timeCost = parseInt(value);
          if (key === "p") paramObj.parallelism = parseInt(value);
        });

        return paramObj;
      }

      // bcrypt format: $2b$12$salt+hash
      if (hash.match(/^\$2[abxy]\$/)) {
        const parts = hash.split("$");
        return {
          algorithm: "bcrypt",
          version: parts[1], // 2a, 2b, 2x, 2y
          cost: parseInt(parts[2]),
        };
      }

      return { algorithm: "unknown" };
    } catch (error) {
      return { algorithm: "invalid" };
    }
  }

  /**
   * Create standardized encryption error
   */
  private static createError(
    code: string,
    operation: string,
    originalError?: any
  ): EncryptionError {
    const error = new Error(
      `Encryption operation failed: ${operation}`
    ) as EncryptionError;
    error.code = code;
    error.operation = operation;
    if (originalError) {
      error.cause = originalError;
    }
    return error;
  }

  /**
   * Derive encryption key from password using PBKDF2 (for AES/RSA key derivation)
   *
   * Note: This is different from password hashing - this generates actual key material
   * for encryption/decryption, while hashPassword() generates hashes for storage.
   *
   * @param password - Password to derive key from
   * @param salt - Salt (should be hex string)
   * @param iterations - PBKDF2 iterations (default 200,000)
   * @param keyLength - Output key length in bytes (default 32)
   * @returns Buffer containing key material
   */

  static deriveKeyForEncryption(
    password: string,
    salt: string,
    iterations: number = 200000,
    keyLength: number = 32
  ): Buffer {
    // Input validation
    if (!password || password.length < 8) {
      throw this.createError(
        "WEAK_PASSWORD",
        "deriveKeyForEncryption",
        new Error("Password must be at least 8 characters")
      );
    }

    if (!salt || Buffer.from(salt, "hex").length < 16) {
      throw this.createError(
        "INSUFFICIENT_SALT",
        "deriveKeyForEncryption",
        new Error("Salt must be at least 128 bits (16 bytes)")
      );
    }

    if (iterations < 100000) {
      throw this.createError(
        "INSUFFICIENT_ITERATIONS",
        "deriveKeyForEncryption",
        new Error(
          "Minimum 100,000 iterations required for encryption key derivation"
        )
      );
    }

    if (keyLength < 16) {
      throw this.createError(
        "INSUFFICIENT_KEY_LENGTH",
        "deriveKeyForEncryption",
        new Error("Minimum 128-bit (16 byte) key length required")
      );
    }

    try {
      // Use Node.js built-in PBKDF2 for key derivation
      const { pbkdf2Sync } = require("crypto");
      return pbkdf2Sync(password, salt, iterations, keyLength, "sha256");
    } catch (error) {
      throw this.createError(
        "KEY_DERIVATION_FAILED",
        "deriveKeyForEncryption",
        error
      );
    }
  }
}
