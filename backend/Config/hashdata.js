const crypto = require('crypto');

const hashData = (data) => {
  if (!data) return null;

  return crypto.createHash('sha256')
               .update(data.trim().toLowerCase())  // Facebook needs lowercase trimmed hashes
               .digest('hex');
};

module.exports = { hashData };
