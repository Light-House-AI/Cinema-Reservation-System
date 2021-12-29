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

  // check if movie has already started
  if (movie.startTime - Date.now() < 0)
    throw new BadRequestError('Movie has already started');

  // check for invalid row and seat
  const room = Rooms[movie.roomId];
  if (!room) throw new NotFoundError('Room not found');

  if (rowNumber > room.numRows || seatNumber > room.numSeats)
    throw new BadRequestError('Invalid seat');

  // prevent booking if the user already has a ticket in this time
  const userTickets = await Ticket.find({
    userId: req.user._id,
  }).populate('movie');

  const overlappingTicket = userTickets.find(
    (ticket) =>
      (ticket.movie[0].startTime <= movie.endTime &&
        ticket.movie[0].endTime >= movie.startTime) ||
      (ticket.movie[0].startTime <= movie.startTime &&
        ticket.movie[0].endTime >= movie.endTime) ||
      (ticket.movie[0].startTime >= movie.startTime &&
        ticket.movie[0].endTime <= movie.endTime)
  );

  if (overlappingTicket)
    throw new BadRequestError('You already have a ticket in this time');

  // create ticket
  const ticket = await Ticket.create({
    userId: req.user._id,
    movieId,
    rowNumber,
    seatNumber,
  });

  res.status(201).json({ ticket });
}

async function cancelBooking(req, res) {
  const { movieId } = req.params;
  const { rowNumber, seatNumber } = req.body;

  const ticket = await Ticket.findOne({
    userId: req.user._id,
    rowNumber,
    seatNumber,
    movieId,
  }).populate('movie');

  if (!ticket) throw new BadRequestError('Ticket not available');

  // check if movie will start in 3 hours
  if (ticket.movie[0].startTime - Date.now() < 3 * 60 * 60 * 1000)
    throw new BadRequestError('Cannot cancel booking');

  await ticket.remove();

  res.status(204).json({});
}

router.post('/booking/:movieId', catchAsync(bookMovie));
router.delete('/booking/:movieId', catchAsync(cancelBooking));

module.exports = router;
