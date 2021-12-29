const express = require('express');

const catchAsync = require('../utils/catchAsync');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/badRequestError');

const User = require('../models/user');
const Movie = require('../models/movie');
const Rooms = require('../models/room');

const router = express.Router();

async function signUp(req, res) {
  if (req.body.role == 'manager') {
    req.body.role = 'customer';
    req.body.hasRequestedRoleUpgrade = true;
  } else {
    req.body.role = 'customer';
    req.body.hasRequestedRoleUpgrade = false;
  }

  await User.create(req.body);

  res.status(201).json({ status: 'success' });
}

async function login(req, res) {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select('+password');

  if (!user || !(await user.isCorrectPassword(password, user.password)))
    throw new BadRequestError('Invalid credentials');

  const token = user.signToken(user._id);
  user.password = undefined;

  res.status(200).json({
    accessToken: token,
    user,
  });
}

async function getAllMovies(req, res) {
  let movies = await Movie.find({
    startTime: { $gte: new Date() },
  }).populate('seats');

  movies = movies.map((movie) => {
    movie = movie.toJSON();
    movie.room = Rooms[movie.roomId];
    movie.numReservedSeats = movie.seats.length;
    movie.seats = undefined;
    return movie;
  });

  res.status(200).json({ results: movies.length, movies });
}

async function getMovie(req, res) {
  const movie = await Movie.findById(req.params.id).populate('seats');
  if (!movie) throw new NotFoundError('Movie not found');

  movie.seats = movie.seats.map((seat) => {
    return { row: seat.rowNumber, seat: seat.seatNumber };
  });

  const room = Rooms[movie.roomId];

  res.status(200).json({ ...movie.toJSON(), room });
}

router.post('/signup', catchAsync(signUp));
router.post('/login', catchAsync(login));
router.get('/movies', catchAsync(getAllMovies));
router.get('/movies/:id', catchAsync(getMovie));

module.exports = router;
