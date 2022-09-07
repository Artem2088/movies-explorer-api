const movieRouter = require('express').Router();
const {
  getMovies,
  postMovies,
  deleteMoviesId,
} = require('../controllers/movie');
const {
  validMoviesId,
  validPostMovies,
} = require('../middlewares/validationJoy');

movieRouter.get('/movies', getMovies);

movieRouter.post('/movies', validPostMovies, postMovies);

movieRouter.delete('/movies/_id', validMoviesId, deleteMoviesId);

module.exports = movieRouter;
