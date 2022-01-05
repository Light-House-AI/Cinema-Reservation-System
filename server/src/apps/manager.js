const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

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

function getOverlappingMoviesCondition(startTime, endTime) {
  return {
    $or: [
      {
        $and: [
          { startTime: { $lte: startTime } },
          { endTime: { $gte: startTime } },
        ],
      },
      {
        $and: [
          { startTime: { $lte: endTime } },
          { endTime: { $gte: endTime } },
        ],
      },
      {
        $and: [
          { startTime: { $gte: startTime } },
          { endTime: { $lte: endTime } },
        ],
      },
    ],
  };
}

async function getFreeRooms(req, res) {
  const { startTime, endTime } = req.query;

  const movies = await Movie.find({
    ...getOverlappingMoviesCondition(startTime, endTime),
  });

  const roomsWithMovies = new Set(movies.map((movie) => movie.roomId));
  const freeRooms = [];

  if (!roomsWithMovies.has(1)) freeRooms.push(1);
  if (!roomsWithMovies.has(2)) freeRooms.push(2);

  res.status(200).json({ freeRooms });
}

async function createMovie(req, res) {
  // check for overlapping times
  const { startTime, endTime } = req.body;

  if (new Date(startTime) > new Date(endTime)) {
    throw new BadRequestError('Start time must be before end time');
  }

  if (new Date(startTime) < new Date()) {
    throw new BadRequestError('Start time must be after current time');
  }

  const overlappingMovies = await Movie.countDocuments({
    ...getOverlappingMoviesCondition(startTime, endTime),
    roomId: req.body.roomId,
  });

  if (overlappingMovies > 0) {
    throw new BadRequestError('The room is already booked for this time');
  }

  // create movie
  const movie = await Movie.create(req.body);
  res.status(201).json({ movie });
}

async function updateMovie(req, res) {
  // get movie
  const movie = await Movie.findById(req.params.id);
  if (!movie) throw new NotFoundError('Movie not found');

  const { startTime, endTime } = req.body;

  if (new Date(startTime) > new Date(endTime)) {
    throw new BadRequestError('Start time must be before end time');
  }

  if (new Date(startTime) < new Date()) {
    throw new BadRequestError('Start time must be after current time');
  }

  // check for overlapping times
  const overlappingMovies = await Movie.countDocuments({
    ...getOverlappingMoviesCondition(startTime, endTime),
    roomId: movie.roomId,
    _id: { $ne: movie._id },
  });

  if (overlappingMovies > 0) {
    throw new BadRequestError('The room is already booked for this time');
  }

  // update movie
  await Movie.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
  });

  res.status(200).json({});
}

async function deleteMovie(req, res) {
  // check if movie has tickets
  const tickets = await Ticket.countDocuments({ movieId: req.params.id });
  if (tickets > 0) throw new BadRequestError('Movie has tickets');

  // delete movie
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) throw new NotFoundError('Movie not found');

  res.status(204).json({});
}

// multer image upload middleware
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // allow images only
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(
        new BadRequestError('Not an image! Please upload only images.'),
        false
      );
    }
  },
});

async function updateMovieImage(req, res) {
  const { file } = req;
  if (!file) throw new BadRequestError('No file uploaded');

  const movie = await Movie.findByIdAndUpdate(req.params.id, {
    image: req.file.path,
  });

  if (!movie) throw new NotFoundError('Movie not found');

  await sharp(file.buffer)
    .toFormat('jpeg')
    .toFile(`${__dirname}/../../public/images/${movie._id}.jpg`);

  if (movie.image === 'images/default.jpg') {
    movie.image = `images/${movie._id}.jpg`;
    await movie.save();
  }

  res.status(200).json({});
}

router.post('/movies', catchAsync(createMovie));
router.get('/movies/free-rooms', catchAsync(getFreeRooms));
router.patch('/movies/:id', catchAsync(updateMovie));
router.delete('/movies/:id', catchAsync(deleteMovie));

router.patch(
  '/movies/:id/image',
  upload.single('image'),
  catchAsync(updateMovieImage)
);

module.exports = router;
