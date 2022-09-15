const Movie = require('../models/movie');
const BadRequest = require('../utils/errorClass/badRequest');
const DocumentNotFound = require('../utils/errorClass/documentNotFound');
const ForbiddenError = require('../utils/errorClass/ForbiddenError');
const {
  incorrectFound,
  incorrectRequest,
  incorrectDelete,
} = require('../constants/errConstMessage');

// возвращает все сохранённые текущим  пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

// создаёт фильм с переданными в теле country, director, duration, year,
// description, image, trailer, nameRU, nameEN и thumbnail, movieId
module.exports.postMovies = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(incorrectRequest));
      } else {
        next(err);
      }
    });
};

// удаляет сохранённый фильм по id
module.exports.deleteMoviesId = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(() => {
      throw new DocumentNotFound(incorrectFound);
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError(incorrectDelete));
      }
      return movie
        .remove()
        .then(() => res.send({ message: 'Карточка удалена успешно' }));
    })
    .catch(next);
};
