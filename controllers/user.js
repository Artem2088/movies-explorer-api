const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const DocumentNotFound = require('../utils/errorClass/documentNotFound');
const BadRequest = require('../utils/errorClass/badRequest');
const DuplicateError = require('../utils/errorClass/duplicateError');
const ErrorUnauthorized = require('../utils/errorClass/errorUnauthorized');
const {
  incorrectFound,
  incorrectRequest,
  incorrectDuplicate,
  incorrectMail,
} = require('../constants/errConstMessage');
const { SALT, MODE } = require('../utils/configFile/config');

// создаёт пользователя с переданными в теле email, password и name
module.exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, SALT);
    const user = await User.create({
      name,
      email,
      password: hash, // записываем хеш в базу
    });
    res.send({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new DuplicateError(incorrectDuplicate));
    } else if (err.name === 'ValidationError') {
      next(
        new BadRequest(
          `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        ),
      );
    } else {
      next(err);
    }
  }
};

// проверяет переданные в теле почту и парольи возвращает JWT
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, MODE, {
        expiresIn: '7d',
      });
      res.send({ token, message: 'Успешная авторизация' });
    })
    .catch((err) => {
      if (err.code === 401) {
        next(new ErrorUnauthorized(incorrectMail));
      } else {
        next(err);
      }
    });
};

// возвращает информацию о пользователе (email и имя)
module.exports.getUsersMe = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      next(new DocumentNotFound(incorrectFound));
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

// обновляет информацию о пользователе (email и имя)
module.exports.patchUsersMe = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => {
      throw new DocumentNotFound(incorrectFound);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(incorrectRequest));
      } else if (err.code === 11000) {
        next(new DuplicateError(incorrectDuplicate));
      } else {
        next(err);
      }
    });
};
