# @bmb-inc/encryption

A **secure wrapper package** around industry-standard cryptographic libraries with **NIST SP 800-132** and **NYDFS compliance**. 

Built on **battle-tested, audited libraries** rather than custom implementations - following the fundamental security principle of **"don't roll your own crypto"**.

## 🔐 **Why Use This Package?**

✅ **Industry-Standard Libraries**: Built on Argon2 (2015 Password Hashing Competition winner) and bcrypt  
✅ **Security-First**: Follows OWASP 2024 recommendations and NIST guidelines  
✅ **Zero Custom Crypto**: No homegrown implementations - only proven, audited algorithms  
✅ **Compliance Ready**: NIST SP 800-132 and NYDFS financial services compliant  
✅ **Future-Proof**: Automatic algorithm detection and migration support  

## 📦 **Core Libraries**

- **[Argon2](https://github.com/ranisalt/node-argon2)**: Primary password hashing (Winner of Password Hashing Competition)
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)**: Battle-tested fallback with 25+ years of usage
- **Node.js Crypto**: Built-in cryptographic utilities for non-password operations

## Installation

```bash
yarn add @bmb-inc/encryption
```

## 🚀 **Quick Start (Recommended)**

### Modern Password Hashing with Argon2

```typescript
import { CryptoUtils } from '@bmb-inc/encryption';

// Hash a password (recommended approach)
const hashedPassword = await CryptoUtils.hashPassword('user-password');
console.log(hashedPassword);
// $argon2id$v=19$m=19456,t=2,p=1$salt$hash

// Verify password
const isValid = await CryptoUtils.verifyPassword('user-password', hashedPassword);
console.log(isValid); // true

// Universal verification (auto-detects Argon2 or bcrypt)
const isValidUniversal = await CryptoUtils.verifyPasswordUniversal('user-password', hashedPassword);
```

### Password Strength Validation

```typescript
const validation = CryptoUtils.validatePasswordStrength('MySecurePass123!');
console.log(validation);
// {
//   isValid: true,
//   score: 5,
//   recommendations: []
// }
```

### Hash Algorithm Analysis

```typescript
const hashInfo = CryptoUtils.getHashInfo(hashedPassword);
console.log(hashInfo);
// {
//   algorithm: 'argon2id',
//   version: 'v=19',
//   memoryCost: 19456,
//   timeCost: 2,
//   parallelism: 1
// }
```

## 📋 **Usage Examples**

### 1. **Argon2 Configuration (Advanced)**

```typescript
// Custom Argon2 parameters for different security/performance needs
const hash1 = await CryptoUtils.hashPassword('password', {
  memoryCost: 47104,  // 46 MiB - High security
  timeCost: 1,        // 1 iteration
  parallelism: 1      // 1 thread
});

const hash2 = await CryptoUtils.hashPassword('password', {
  memoryCost: 9216,   // 9 MiB - Balanced
  timeCost: 5,        // 5 iterations  
  parallelism: 1      // 1 thread
});
```

### 2. **bcrypt for Legacy Systems**

```typescript
// bcrypt for systems that require it
const bcryptHash = await CryptoUtils.hashPasswordBcrypt('password', 12);
const isValidBcrypt = await CryptoUtils.verifyPasswordBcrypt('password', bcryptHash);

// bcrypt with NYDFS compliance (minimum 10 rounds)
const secureHash = await CryptoUtils.hashPasswordBcrypt('password', 14);
```

### 3. **Migration-Friendly Universal Verification**

```typescript
// Works with both Argon2 and bcrypt hashes automatically
async function loginUser(password: string, storedHash: string) {
  try {
    const isValid = await CryptoUtils.verifyPasswordUniversal(password, storedHash);
    
    if (isValid) {
      // Optional: Upgrade old bcrypt hashes to Argon2
      if (storedHash.startsWith('$2')) {
        const newHash = await CryptoUtils.hashPassword(password);
        // Update database with newHash
      }
      
      return { success: true };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}
```

### 4. **Cryptographic Utilities**

```typescript
// Generate secure random values
const apiKey = CryptoUtils.generateRandomKey(32);
const salt = CryptoUtils.generateSalt(16);

// Generate cryptographically secure IVs
const iv = CryptoUtils.generateIV(16);  // Manual length
const ivForAES = CryptoUtils.generateIVForAlgorithm('aes-256-cbc');  // Algorithm-specific

// Hash non-password data
const dataHash = CryptoUtils.hash('important-data', { algorithm: 'sha256' });

// Timing-attack resistant comparison
const isEqual = CryptoUtils.constantTimeCompare(hash1, hash2);
```

## 🏆 **Security Standards Compliance**

### **OWASP Password Storage 2024**
- ✅ **Argon2id**: Minimum 19 MiB memory, 2 iterations, 1 parallelism
- ✅ **bcrypt**: Minimum work factor 10, handles 72-byte limit
- ✅ **Secure Defaults**: Optimal parameters out-of-the-box

### **NIST SP 800-132**
- ✅ **Salt Length**: Minimum 128 bits (16 bytes)
- ✅ **Memory Hardness**: Argon2id memory-hard algorithm  
- ✅ **Approved Functions**: SHA-256 for auxiliary operations
- ✅ **Iteration Counts**: Exceeds minimum recommendations

### **NYDFS Cybersecurity**
- ✅ **Strong Authentication**: Password complexity validation
- ✅ **Audit Trail**: Algorithm identification and parameters
- ✅ **Defense in Depth**: Multiple algorithm support
- ✅ **Risk Management**: Secure defaults and validation

### **CWE-327/347 Security (IV/Cryptography)**
- ✅ **Cryptographically Secure IVs**: Uses Node.js crypto.randomBytes (CSPRNG)
- ✅ **No IV Reuse**: Each IV is cryptographically unique and unpredictable
- ✅ **Algorithm-Specific**: Proper IV lengths for each encryption algorithm
- ✅ **Entropy Validation**: Additional checks prevent weak IV generation
- ✅ **Dictionary Attack Prevention**: Random IVs prevent predictable patterns

## 🔄 **Migration Guide**

### From Other Libraries
```typescript
// From bcrypt library
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash(password, 12);

// To our wrapper (same underlying library)
const hash = await CryptoUtils.hashPasswordBcrypt(password, 12);
const isValid = await CryptoUtils.verifyPasswordBcrypt(password, hash);

// Or upgrade to Argon2
const argonHash = await CryptoUtils.hashPassword(password);
```

## ⚡ **Performance Considerations**

### **Argon2 Parameters (Choose One)**

| Use Case | Memory | Time | Parallelism | Performance |
|----------|--------|------|-------------|-------------|
| **High Security** | 46 MiB | 1 | 1 | ~1-2 seconds |
| **Balanced** ⭐ | 19 MiB | 2 | 1 | ~0.5-1 second |
| **Fast** | 9 MiB | 4 | 1 | ~0.2-0.5 seconds |

### **bcrypt Rounds**

| Rounds | Time (2024 hardware) | Use Case |
|--------|---------------------|----------|
| 10 | ~100ms | Minimum (NYDFS) |
| 12 | ~250ms | **Recommended** |
| 14 | ~1000ms | High security |

## 🛠 **API Reference**

### **Primary Methods (Async)**
```typescript
// Argon2 (Recommended)
CryptoUtils.hashPassword(password, options?) → Promise<string>
CryptoUtils.verifyPassword(password, hash) → Promise<boolean>

// bcrypt (Fallback)
CryptoUtils.hashPasswordBcrypt(password, rounds?) → Promise<string>
CryptoUtils.verifyPasswordBcrypt(password, hash) → Promise<boolean>

// Universal (Auto-detect)
CryptoUtils.verifyPasswordUniversal(password, hash) → Promise<boolean>
```

### **Utility Methods (Sync)**
```typescript
// Validation
CryptoUtils.validatePasswordStrength(password) → {isValid, score, recommendations}
CryptoUtils.validateKeyStrength(key, minLength?) → boolean

// Generation
CryptoUtils.generateRandomKey(length?) → string
CryptoUtils.generateSalt(length?) → string
CryptoUtils.generateIV(length?) → Buffer
CryptoUtils.generateIVForAlgorithm(algorithm) → Buffer

// Analysis
CryptoUtils.getHashInfo(hash) → {algorithm, version, cost, ...}
CryptoUtils.constantTimeCompare(a, b) → boolean
CryptoUtils.hash(data, options?) → string

// Key Derivation (for encryption, not password storage)
CryptoUtils.deriveKeyForEncryption(password, salt, iterations?, keyLength?) → Buffer
```



## 🔒 **Security Best Practices**

### ✅ **Do This**
```typescript
// Use modern Argon2 for new applications  
const hash = await CryptoUtils.hashPassword(password);

// Validate passwords before hashing
const validation = CryptoUtils.validatePasswordStrength(password);
if (!validation.isValid) {
  throw new Error(`Weak password: ${validation.recommendations.join(', ')}`);
}

// Use universal verification for mixed environments
const isValid = await CryptoUtils.verifyPasswordUniversal(password, storedHash);

// Upgrade legacy hashes when users login
if (storedHash.startsWith('$2')) {
  const newHash = await CryptoUtils.hashPassword(password);
  // Update stored hash
}
```

### ❌ **Don't Do This**
```typescript
// Don't use weak bcrypt rounds
const hash = await CryptoUtils.hashPasswordBcrypt(password, 8); // Too weak

// Don't store passwords in plain text or with weak hashing
const hash = crypto.createHash('md5').update(password).digest('hex'); // Insecure

// Don't use old algorithms like MD5, SHA1 for passwords
const badHash = crypto.createHash('sha1').update(password).digest('hex'); // Vulnerable
```

## 🤝 **Why This Approach?**

### **Security Benefits**
- **Proven Algorithms**: Built on libraries with millions of downloads and extensive audits
- **No Custom Crypto**: Eliminates implementation vulnerabilities
- **Regular Updates**: Underlying libraries are actively maintained and patched
- **Expert Reviewed**: Argon2 and bcrypt designed by cryptographic experts

### **Development Benefits**  
- **Simple API**: Clean wrapper around complex cryptographic operations
- **Future-Proof**: Easy to upgrade algorithms as standards evolve
- **Migration Support**: Universal verification works with multiple hash types
- **Compliance Ready**: Meets current regulatory requirements out-of-the-box

### **Operational Benefits**
- **Performance Tuned**: Optimal defaults based on current hardware
- **Monitoring Ready**: Built-in algorithm detection and parameter extraction
- **Error Handling**: Comprehensive error messages with security context
- **Backward Compatible**: Supports legacy systems during migration

## 📝 **License**

MIT License - See LICENSE file for details.

---

**Built with ❤️ using proven cryptographic libraries, not custom implementations.** 