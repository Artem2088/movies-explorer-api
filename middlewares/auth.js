const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../utils/errorClass/errorUnauthorized');
const { incorrectAuth } = require('../constants/errConstMessage');
const { MODE } = require('../utils/configFile/config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new ErrorUnauthorized(incorrectAuth);
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, MODE);
  } catch (err) {
    throw new ErrorUnauthorized(incorrectAuth);
  }

  req.user = payload;

  next();
};
