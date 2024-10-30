const jwt = require('jsonwebtoken');

const secretKey = 'your-secret-key';

function generateToken(username) {
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
  return token;
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
