const crypto = require("crypto");

/**
 * Generate a random hex token
 * @param {number} size - number of random bytes (default: 32)
 * @returns {string} hex token
 */
function generateToken(size = 32) {
  return crypto.randomBytes(size).toString("hex");
}

module.exports = { generateToken };
