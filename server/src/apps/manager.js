const express = require('express');
const restrictTo = require('../middlewares/restrictTo');
const protect = require('../middlewares/protect');
const catchAsync = require('../utils/catchAsync');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/badRequestError');

const Movie = require('../models/movie');
const Ticket = require('../models/ticket');

const router = express.Router();

router.use(protect);
router.use(restrictTo('manager'));

async function createMovie(req, res) {
  //TODO: check slots
  //TODO: upload image
  const movie = await Movie.create(req.body);
  res.status(201).json({ movie });
}

async function updateMovie(req, res) {
  //TODO: check slots
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!movie) throw new NotFoundError('Movie not found');
  res.status(200).json({ movie });
}

async function deleteMovie(req, res) {
  const tickets = await Ticket.countDocuments({ movieId: req.params.id });
  if (tickets > 0) throw new BadRequestError('Movie has tickets');

  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) throw new NotFoundError('Movie not found');

  res.status(204).json({});
}

router.post('/movies', catchAsync(createMovie));
router.patch('/movies/:id', catchAsync(updateMovie));
router.delete('/movies/:id', catchAsync(deleteMovie));

module.exports = router;
