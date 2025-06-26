import {
  generateKeyPairSync,
  publicEncrypt,
  privateDecrypt,
  sign,
  verify,
  createPublicKey,
  createPrivateKey,
} from "crypto";
import { KeyPair, RSAOptions, EncryptionError } from "./types";
import { AESCrypto } from "./aes";
import { CryptoUtils } from "./utils";

export class RSACrypto {
  private readonly keySize: number;
  private readonly publicExponent: number;

  constructor(options: RSAOptions = {}) {
    this.keySize = options.keySize || 2048;
    this.publicExponent = options.publicExponent || 65537;
  }

  /**
   * Generate RSA key pair for asymmetric encryption
   */
  generateKeyPair(): KeyPair {
    try {
      const { publicKey, privateKey } = generateKeyPairSync("rsa", {
        modulusLength: this.keySize,
        publicExponent: this.publicExponent,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      });

      return {
        publicKey: publicKey.toString(),
        privateKey: privateKey.toString(),
      };
    } catch (error) {
      throw this.createError("KEY_GENERATION_FAILED", "generateKeyPair", error);
    }
  }

  /**
   * Encrypt data using RSA public key
   * Note: RSA is best for small data (like symmetric keys)
   */
  encrypt(plaintext: string, publicKey: string): string {
    try {
      const buffer = Buffer.from(plaintext, "utf8");
      const encrypted = publicEncrypt(publicKey, buffer);
      return encrypted.toString("base64");
    } catch (error) {
      throw this.createError("ENCRYPTION_FAILED", "encrypt", error);
    }
  }

  /**
   * Decrypt data using RSA private key
   */
  decrypt(ciphertext: string, privateKey: string): string {
    try {
      const buffer = Buffer.from(ciphertext, "base64");
      const decrypted = privateDecrypt(privateKey, buffer);
      return decrypted.toString("utf8");
    } catch (error) {
      throw this.createError("DECRYPTION_FAILED", "decrypt", error);
    }
  }

  /**
   * Create digital signature using RSA private key
   */
  sign(
    data: string,
    privateKey: string,
    algorithm: string = "RSA-SHA256"
  ): string {
    try {
      const signature = sign(algorithm, Buffer.from(data, "utf8"), privateKey);
      return signature.toString("base64");
    } catch (error) {
      throw this.createError("SIGNING_FAILED", "sign", error);
    }
  }

  /**
   * Verify digital signature using RSA public key
   */
  verify(
    data: string,
    signature: string,
    publicKey: string,
    algorithm: string = "RSA-SHA256"
  ): boolean {
    try {
      const signatureBuffer = Buffer.from(signature, "base64");
      return verify(
        algorithm,
        Buffer.from(data, "utf8"),
        publicKey,
        signatureBuffer
      );
    } catch (error) {
      throw this.createError("VERIFICATION_FAILED", "verify", error);
    }
  }

  /**
   * Encrypt large data by combining RSA and AES (hybrid encryption)
   * RSA encrypts the AES key, AES encrypts the data
   */
  encryptLarge(
    plaintext: string,
    publicKey: string
  ): { encryptedData: string; encryptedKey: string; iv: string } {
    try {
      // Generate random AES key
      const aesKey = CryptoUtils.generateRandomKey(32);

      // Encrypt data with AES
      const aesCrypto = new AESCrypto();
      const encryptedData = aesCrypto.encrypt(plaintext, aesKey);

      // Encrypt AES key with RSA
      const encryptedKey = this.encrypt(aesKey, publicKey);

      return {
        encryptedData: encryptedData.encrypted,
        encryptedKey,
        iv: encryptedData.iv,
      };
    } catch (error) {
      throw this.createError("HYBRID_ENCRYPTION_FAILED", "encryptLarge", error);
    }
  }

  /**
   * Decrypt large data encrypted with hybrid encryption
   */
  decryptLarge(
    encryptedData: string,
    encryptedKey: string,
    iv: string,
    privateKey: string
  ): string {
    try {
      // Decrypt AES key with RSA
      const aesKey = this.decrypt(encryptedKey, privateKey);

      // Decrypt data with AES
      const aesCrypto = new AESCrypto();
      return aesCrypto.decrypt(encryptedData, aesKey, iv);
    } catch (error) {
      throw this.createError("HYBRID_DECRYPTION_FAILED", "decryptLarge", error);
    }
  }

  /**
   * Extract public key from private key
   */
  extractPublicKey(privateKey: string): string {
    try {
      const publicKey = createPublicKey(privateKey);

      return publicKey
        .export({
          type: "spki",
          format: "pem",
        })
        .toString();
    } catch (error) {
      throw this.createError(
        "PUBLIC_KEY_EXTRACTION_FAILED",
        "extractPublicKey",
        error
      );
    }
  }

  /**
   * Validate RSA key format
   */
  validateKey(key: string, type: "public" | "private"): boolean {
    try {
      if (type === "public") {
        createPublicKey(key);
      } else {
        createPrivateKey(key);
      }
      return true;
    } catch {
      return false;
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
      `RSA operation failed: ${operation}`
    ) as EncryptionError;
    error.code = code;
    error.operation = operation;
    if (originalError) {
      error.cause = originalError;
    }
    return error;
  }
}
