const express = require('express');
const restrictTo = require('../middlewares/restrictTo');
const protect = require('../middlewares/protect');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.use(protect);
router.use(restrictTo('manager'));

async function createMovie(req, res) {
  res.send('Create a movie');
}

async function updateMovie(req, res) {
  res.send('Update a movie');
}

async function deleteMovie(req, res) {
  res.send('Delete a movie');
}

router.post('/movie', catchAsync(createMovie));
router.patch('/movie/:id', catchAsync(updateMovie));
router.delete('/movie/:id', catchAsync(deleteMovie));

module.exports = router;
