import { pbkdf2Sync, scryptSync, timingSafeEqual } from "crypto";
import { PasswordHashOptions, EncryptionError } from "./types";
import { CryptoUtils } from "./utils";

export class PasswordCrypto {
  private readonly algorithm: string;
  private readonly saltRounds: number;

  constructor(options: PasswordHashOptions = {}) {
    this.algorithm = options.algorithm || "pbkdf2";
    this.saltRounds = options.saltRounds || 100000;
  }

  /**
   * Hash password with salt using specified algorithm
   * Returns format: algorithm:iterations:salt:hash
   */
  hashPassword(password: string): string {
    try {
      const salt = CryptoUtils.generateSalt(32);

      let hash: Buffer;
      let hashString: string;

      switch (this.algorithm) {
        case "pbkdf2":
          hash = pbkdf2Sync(password, salt, this.saltRounds, 64, "sha256");
          hashString = `pbkdf2:${this.saltRounds}:${salt}:${hash.toString(
            "hex"
          )}`;
          break;

        case "scrypt":
          hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
          hashString = `scrypt:${16384}:${salt}:${hash.toString("hex")}`;
          break;

        default:
          throw new Error(`Unsupported algorithm: ${this.algorithm}`);
      }

      return hashString;
    } catch (error) {
      throw this.createError("PASSWORD_HASHING_FAILED", "hashPassword", error);
    }
  }

  /**
   * Verify password against stored hash
   */
  verifyPassword(password: string, storedHash: string): boolean {
    try {
      const parts = storedHash.split(":");
      if (parts.length !== 4) {
        throw new Error("Invalid hash format");
      }

      const [algorithm, iterations, salt, expectedHash] = parts;
      let computedHash: Buffer;

      switch (algorithm) {
        case "pbkdf2":
          computedHash = pbkdf2Sync(
            password,
            salt,
            parseInt(iterations),
            64,
            "sha256"
          );
          break;

        case "scrypt":
          const N = parseInt(iterations);
          computedHash = scryptSync(password, salt, 64, { N, r: 8, p: 1 });
          break;

        default:
          throw new Error(`Unsupported algorithm: ${algorithm}`);
      }

      const expectedBuffer = Buffer.from(expectedHash, "hex");

      // Use timing-safe comparison to prevent timing attacks
      return timingSafeEqual(computedHash, expectedBuffer);
    } catch (error) {
      throw this.createError(
        "PASSWORD_VERIFICATION_FAILED",
        "verifyPassword",
        error
      );
    }
  }

  /**
   * Check password strength
   */
  checkPasswordStrength(password: string): {
    score: number;
    feedback: string[];
    isStrong: boolean;
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 12) {
      score += 2;
    } else if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("Password should be at least 8 characters long");
    }

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("Include lowercase letters");

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("Include uppercase letters");

    if (/\d/.test(password)) score += 1;
    else feedback.push("Include numbers");

    if (/[^a-zA-Z\d]/.test(password)) score += 1;
    else feedback.push("Include special characters");

    // Common patterns
    if (/(.)\1{2,}/.test(password)) {
      score -= 1;
      feedback.push("Avoid repeating characters");
    }

    if (/^(password|123456|qwerty|admin)/i.test(password)) {
      score -= 2;
      feedback.push("Avoid common passwords");
    }

    const isStrong = score >= 5;

    return {
      score: Math.max(0, Math.min(10, score * 2)), // Scale to 0-10
      feedback,
      isStrong,
    };
  }

  /**
   * Generate secure random password
   */
  generateSecurePassword(
    length: number = 16,
    options: {
      includeUppercase?: boolean;
      includeLowercase?: boolean;
      includeNumbers?: boolean;
      includeSymbols?: boolean;
      excludeSimilar?: boolean;
    } = {}
  ): string {
    const {
      includeUppercase = true,
      includeLowercase = true,
      includeNumbers = true,
      includeSymbols = true,
      excludeSimilar = false,
    } = options;

    let charset = "";

    if (includeLowercase) {
      charset += excludeSimilar
        ? "abcdefghjkmnpqrstuvwxyz"
        : "abcdefghijklmnopqrstuvwxyz";
    }

    if (includeUppercase) {
      charset += excludeSimilar
        ? "ABCDEFGHJKMNPQRSTUVWXYZ"
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }

    if (includeNumbers) {
      charset += excludeSimilar ? "23456789" : "0123456789";
    }

    if (includeSymbols) {
      charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    }

    if (charset.length === 0) {
      throw new Error("At least one character type must be included");
    }

    try {
      let password = "";

      // Use rejection sampling to avoid modulo bias
      for (let i = 0; i < length; i++) {
        let randomIndex: number;
        let randomByte: number;

        // Keep generating random bytes until we get one that doesn't cause modulo bias
        do {
          const randomBuffer = CryptoUtils.generateIV(1);
          randomByte = randomBuffer[0];
        } while (
          randomByte >=
          Math.floor(256 / charset.length) * charset.length
        );

        randomIndex = randomByte % charset.length;
        password += charset[randomIndex];
      }

      return password;
    } catch (error) {
      throw this.createError(
        "PASSWORD_GENERATION_FAILED",
        "generateSecurePassword",
        error
      );
    }
  }

  /**
   * Hash password with custom parameters (for migration/compatibility)
   */
  hashPasswordCustom(
    password: string,
    algorithm: "pbkdf2" | "scrypt",
    iterations: number,
    salt?: string
  ): string {
    try {
      const actualSalt = salt || CryptoUtils.generateSalt(32);
      let hash: Buffer;
      let hashString: string;

      switch (algorithm) {
        case "pbkdf2":
          hash = pbkdf2Sync(password, actualSalt, iterations, 64, "sha256");
          hashString = `pbkdf2:${iterations}:${actualSalt}:${hash.toString(
            "hex"
          )}`;
          break;

        case "scrypt":
          hash = scryptSync(password, actualSalt, 64, {
            N: iterations,
            r: 8,
            p: 1,
          });
          hashString = `scrypt:${iterations}:${actualSalt}:${hash.toString(
            "hex"
          )}`;
          break;

        default:
          throw new Error(`Unsupported algorithm: ${algorithm}`);
      }

      return hashString;
    } catch (error) {
      throw this.createError(
        "CUSTOM_PASSWORD_HASHING_FAILED",
        "hashPasswordCustom",
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
      `Password crypto operation failed: ${operation}`
    ) as EncryptionError;
    error.code = code;
    error.operation = operation;
    if (originalError) {
      error.cause = originalError;
    }
    return error;
  }
}
