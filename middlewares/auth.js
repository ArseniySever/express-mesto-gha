const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../error/UnauthorizedError');

function auth(req, res, next) {
  try {
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
  } catch (err) {
    next(err);
  }
}

module.exports = { auth };
