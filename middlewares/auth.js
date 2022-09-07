const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../utils/errorClass/errorUnauthorized');
const { incorrectAuth } = require('../constants/errConstMessage');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorUnauthorized(incorrectAuth);
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key'
    );
  } catch (err) {
    throw new ErrorUnauthorized(incorrectAuth);
  }

  req.user = payload;

  next();
};
