const { verifyToken } = require('./jwtUtils');
module.exports = function(req, res, next) {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if(!token) return res.status(401).json({error:'Unauthorized'});
  try { req.user = verifyToken(token); next(); } catch(e) { res.status(401).json({error:'Invalid token'}); }
};
