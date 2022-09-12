require('dotenv').config();

const {
  PORT, DB_CONN, SALT_ROUND, NODE_ENV, JWT_SECRET,
} = process.env;

module.exports.DB_DEV = DB_CONN || 'mongodb://localhost:27017/mestodb';

module.exports.PORT_DEV = PORT || 3001;

module.exports.SALT = SALT_ROUND || 10;

module.exports.MODE = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key';
