const express = require('express');
const restrictTo = require('../middlewares/restrictTo');
const protect = require('../middlewares/protect');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

async function signUp(req, res) {
  res.send('Sign up');
}

async function login(req, res) {
  res.send('Login');
}

async function getAllMovies(req, res) {
  res.send('Get all movies');
}

async function getMovie(req, res) {
  res.send('Get a movie');
}

router.post('/signup', catchAsync(signUp));
router.post('/login', catchAsync(login));
router.get('/movies', catchAsync(getAllMovies));
router.get('/movies/:id', catchAsync(getMovie));

module.exports = router;
