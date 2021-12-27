const express = require('express');
const restrictTo = require('../middlewares/restrictTo');
const protect = require('../middlewares/protect');
const catchAsync = require('../utils/catchAsync');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/badRequestError');

const Movie = require('../models/movie');
const Ticket = require('../models/ticket');
const Rooms = require('../models/room');

const router = express.Router();

router.use(protect);
router.use(restrictTo('customer'));

async function bookMovie(req, res) {
  const { movieId } = req.params;
  const { rowNumber, seatNumber } = req.body;

  const movie = await Movie.findById(movieId);
  if (!movie) throw new NotFoundError('Movie not found');

  const room = Rooms[movie.roomId];
  if (!room) throw new NotFoundError('Room not found');

  if (rowNumber > room.numRows || seatNumber > room.numSeats)
    throw new BadRequestError('Invalid seat');

  const ticket = await Ticket.create({
    userId: req.user._id,
    movieId,
    rowNumber,
    seatNumber,
  });

  if (!ticket) throw new BadRequestError('Ticket not available');

  res.status(201).json({ ticket });
}

async function cancelBooking(req, res) {
  const { movieId } = req.params;
  const { rowNumber, seatNumber } = req.body;

  const ticket = await Ticket.findOneAndDelete({
    userId: req.user._id,
    rowNumber,
    seatNumber,
    movieId,
  });

  if (!ticket) throw new BadRequestError('Ticket not available');

  res.status(204).json({});
}

router.post('/booking/:movieId', catchAsync(bookMovie));
router.delete('/booking/:movieId', catchAsync(cancelBooking));

module.exports = router;
