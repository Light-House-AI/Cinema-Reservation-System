const express = require('express');

const restrictTo = require('../middlewares/restrictTo');
const protect = require('../middlewares/protect');
const catchAsync = require('../utils/catchAsync');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/badRequestError');

const User = require('../models/user');

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

async function getAllUnapprovedUsers(req, res) {
  const users = await User.find({ hasRequestedRoleUpgrade: true });
  res.status(200).json({ results: users.length, users });
}

async function getAllUsers(req, res) {
  const users = await User.find({ role: { $ne: 'admin' } });
  res.status(200).json({ results: users.length, users });
}

async function deleteUser(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new NotFoundError('User not found');
  res.status(204).json({});
}

async function approveUser(req, res) {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, hasRequestedRoleUpgrade: true },
    {
      hasRequestedRoleUpgrade: false,
      role: 'manager',
    }
  );

  if (!user) throw new NotFoundError('User not found');
  res.status(200).json({});
}

router.get('/users', catchAsync(getAllUsers));
router.get('/users/unapproved', catchAsync(getAllUnapprovedUsers));
router.patch('/users/:id', catchAsync(approveUser));
router.delete('/users/:id', catchAsync(deleteUser));

module.exports = router;
