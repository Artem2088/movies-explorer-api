const express = require('express');

const router = express.Router();
const userRouter = require('./user');
const movieRouter = require('./movie');
const { createUser, login } = require('../controllers/user');
const DocumentNotFound = require('../utils/errorClass/documentNotFound');
const { incorrectFound } = require('../constants/errConstMessage');
const { validCreateUser, validLogin } = require('../middlewares/validationJoy');
const auth = require('../middlewares/auth');

router.post('/signup', validCreateUser, createUser);
router.post('/signin', validLogin, login);
router.use('/', auth, userRouter);
router.use('/', auth, movieRouter);

// обработчик не существующей страницы
router.use('*', auth, (req, res, next) => {
  next(new DocumentNotFound(incorrectFound));
});

// нужно удалить после ревью!
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

module.exports = router;
