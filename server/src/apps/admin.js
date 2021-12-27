const express = require('express');
const restrictTo = require('../middlewares/restrictTo');
const protect = require('../middlewares/protect');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

async function getAllUsers(req, res) {
  res.send('Get all users');
}

async function deleteUser(req, res) {
  res.send('Delete a user');
}

router.get('/users', catchAsync(getAllUsers));
router.delete('/user/:id', catchAsync(deleteUser));

module.exports = router;
