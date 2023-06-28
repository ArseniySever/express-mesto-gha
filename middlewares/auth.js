const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../error/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) {
    throw new UnauthorizedError('Authorization is needed');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secretkey', '');
  } catch (err) {
    throw new UnauthorizedError('Authorization is needed');
  }

  req.user = payload;
  next();
};
