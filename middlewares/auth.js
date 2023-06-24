const jwt = require('jsonwebtoken');

const { UnauthorizedError } = require('../error/UnauthorizedError');

const auth = (req, res, next) => {
  try {
    const { authorization } = req.cookies.jwt;
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
  } catch (err) {
    next(err);
  }
};

module.exports = {
  auth,
};
