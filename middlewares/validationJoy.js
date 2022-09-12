const { celebrate, Joi } = require('celebrate');
const {
  Regular,
  cyrillicPattern,
  latinPattern,
} = require('../helpers/regular');

const validLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validPatchUsersMe = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
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
    image: Joi.string().required().regex(Regular),
    trailerLink: Joi.string().required().regex(Regular),
    thumbnail: Joi.string().required().regex(Regular),
    movieId: Joi.string().hex().length(24).required(),
    nameRU: Joi.string().required().regex(cyrillicPattern),
    nameEN: Joi.string().required().regex(latinPattern),
  }),
});

const validMoviesId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validCreateUser,
  validLogin,
  validPatchUsersMe,
  validPostMovies,
  validMoviesId,
};
