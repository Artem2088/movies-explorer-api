require('dotenv').config();

const { PORT, DB_CONN } = process.env;

module.exports.DB_DEV = DB_CONN || 'mongodb://localhost:27017/mestodb';

module.exports.PORT_DEV = PORT || 3001;
