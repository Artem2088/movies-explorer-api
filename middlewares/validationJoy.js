const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { cyrillicPattern, latinPattern } = require('../helpers/regular');

const validLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validPatchUsersMe = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validPostMovies = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string()
      .required()
      .custom((value, halpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return halpers.message('URL адрес невалидный ');
      }),
    trailerLink: Joi.string()
      .required()
      .custom((value, halpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return halpers.message('URL адрес невалидный ');
      }),
    thumbnail: Joi.string()
      .required()
      .custom((value, halpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return halpers.message('URL адрес невалидный ');
      }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().regex(cyrillicPattern),
    nameEN: Joi.string().required().regex(latinPattern),
  }),
});

const validMoviesId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
});

module.exports = {
  validCreateUser,
  validLogin,
  validPatchUsersMe,
  validPostMovies,
  validMoviesId,
};
