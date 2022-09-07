require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { centrErr } = require('./middlewares/centrErr');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/user');
const movieRouter = require('./routes/movie');
const { createUser, login } = require('./controllers/user');
const DocumentNotFound = require('./utils/errorClass/documentNotFound');
const ConnectTimedOut = require('./utils/errorClass/сonnectTimedOut');
const { incorrectFound } = require('./constants/errConstMessage');
const { validCreateUser, validLogin } = require('./middlewares/validationJoy');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT_DEV, DB_DEV } = require('./utils/configFile/config');

const app = express();

app.use(helmet());

mongoose.connect(DB_DEV).catch((error) => new ConnectTimedOut(error));

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(
  cors({
    origin: [
      'https://api.domainname.artem.nomoredomains.sbs',
      'https://domainname.artem.nomoredomains.sbs',
      'http://domainname.artem.nomoredomains.sbs',
      'http://localhost:3001',
      'http://localhost:3000',
    ],
  })
);

app.post('/signup', validCreateUser, createUser);
app.post('/signin', validLogin, login);

app.use('/', auth, userRouter);
app.use('/', auth, movieRouter);

// обработчик не существующей страницы
app.use('*', auth, (req, res, next) => {
  try {
    next(new DocumentNotFound(incorrectFound));
  } catch (err) {
    next(err);
  }
});

app.use(errorLogger);

app.use(errors());
app.use(centrErr); // централизованный обработчик

app.listen(PORT_DEV, () => {
  console.log(`App listening on port ${PORT_DEV}`);
});
