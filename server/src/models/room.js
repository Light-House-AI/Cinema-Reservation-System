const mongoose = require('mongoose');
const validator = require('validator');

const roomSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, 'Please provide a number'],
    unique: true,
    min: [0, 'Number must be at least 0'],
    validate: [validator.isInt, 'Number must be an integer'],
  },
  numRows: {
    type: Number,
    required: [true, 'Please provide the number of rows'],
    min: [1, 'Number of rows must be at least 1'],
  },
  seatsPerRow: {
    type: Number,
    required: [true, 'Please provide the number of seats per row'],
    min: [1, 'Number of seats per row must be at least 1'],
  },
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
