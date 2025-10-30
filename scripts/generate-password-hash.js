#!/usr/bin/env node

const crypto = require('crypto');

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function generateSalt() {
  return crypto.randomBytes(32).toString('hex');
}

// Get password from command line argument
const password = process.argv[2];

if (!password) {
  console.error('Usage: node generate-password-hash.js <password>');
  console.error('Example: node generate-password-hash.js mySecurePassword123');
  process.exit(1);
}

// Generate salt and hash
const salt = generateSalt();
const hash = hashPassword(password, salt);

console.log('\n🔐 Password Hash Generated');
console.log('==========================');
console.log('\nAdd these to your production .env file:');
console.log(`ADMIN_PASSWORD_SALT="${salt}"`);
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
console.log('\n⚠️  Important Security Notes:');
console.log('1. Never commit these values to git');
console.log('2. Store them securely in your production environment');
console.log('3. The original password is not stored anywhere');
console.log('4. These hashes cannot be reversed to get the original password');
console.log('\n✅ Your password is now secure for production deployment!');
