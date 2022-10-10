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

movieRouter.delete('/movies/:movieId', validMoviesId, deleteMoviesId);

module.exports = movieRouter;
