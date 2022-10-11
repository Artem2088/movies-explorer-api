require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const { centrErr } = require('./middlewares/centrErr');
const ConnectTimedOut = require('./utils/errorClass/сonnectTimedOut');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT_DEV, DB_DEV } = require('./utils/configFile/config');

const app = express();
const router = require('./routes/index');
const { apiLimiter } = require('./middlewares/rateLimiter');

app.use(helmet());

mongoose
  .connect(DB_DEV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .catch((error) => new ConnectTimedOut(console.log(error)));

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(
  cors({
    origin: [
      'https://api.domainname.artem.nomoredomains.sbs',
      'https://domainname.artem.nomoredomains.sbs',
      'http://api.domainname.artem.nomoredomains.sbs',
      'http://domainname.artem.nomoredomains.sbs',
      'http://localhost:3001',
      'http://localhost:3000',
    ],
  })
);

app.use(apiLimiter);

app.use(router);
app.use(errorLogger);

app.use(errors());
app.use(centrErr); // централизованный обработчик

app.listen(PORT_DEV, () => {
  console.log(`App listening on port ${PORT_DEV}`);
});
