const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../error/UnauthorizedError');

function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('UnregisteredUser');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'secretcode');
  } catch (err) {
    throw new UnauthorizedError('UNAUTHORIZED');
  }
  req.user = payload;
  next();
}

module.exports = { auth };
