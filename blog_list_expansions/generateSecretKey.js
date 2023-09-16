// Import the crypto module
const crypto = require('crypto');

// Generate a random secret key (32 bytes, or 256 bits)
const secretKey = crypto.randomBytes(32).toString('hex');

// Print the generated secret key
console.log('Generated Secret Key:');
console.log(secretKey);
