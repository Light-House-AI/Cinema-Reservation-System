const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username must be at most 20 characters long'],
  },
  role: {
    type: String,
    enum: ['customer', 'manager', 'admin'],
    default: 'customer',
  },
  hasRequestedRoleUpgrade: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    validate: [
      validator.isStrongPassword,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    ],
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
