const express = require('express');
const restrictTo = require('../middlewares/restrictTo');
const protect = require('../middlewares/protect');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.use(protect);
router.use(restrictTo('customer'));

async function bookMove(req, res) {
  res.send('Book a movie');
}

async function cancelBooking(req, res) {
  res.send('Cancel a booking');
}

router.post('/booking', catchAsync(bookMove));
router.delete('/booking/:id', catchAsync(cancelBooking));

module.exports = router;
