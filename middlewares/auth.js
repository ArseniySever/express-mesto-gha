const jwt = require('jsonwebtoken');

const ERROR_CODE_UNAUTHORIZED = 401;

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      res.status(ERROR_CODE_UNAUTHORIZED).send({ message: 'UNAUTHORIZED' });
    }
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, 'secretcode');
    } catch (err) {
      res.status(ERROR_CODE_UNAUTHORIZED).send({ message: 'UNAUTHORIZED' });
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
