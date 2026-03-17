const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'engse207-shared-jwt-secret-set2';
module.exports = {
  generateToken: (payload) => jwt.sign(payload, SECRET, { expiresIn: '1h' }),
  verifyToken: (token) => jwt.verify(token, SECRET)
};
