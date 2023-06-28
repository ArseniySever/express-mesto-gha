const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../error/UnauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(res);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new UnauthorizedError(res);
  }

  req.user = payload;
  next();
};
module.exports = auth;
