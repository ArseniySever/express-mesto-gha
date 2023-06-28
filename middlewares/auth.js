const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../error/UnauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

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
module.exports = auth;
