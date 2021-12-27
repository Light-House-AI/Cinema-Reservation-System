const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [50, 'Title must be at most 50 characters long'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  image: {
    type: String,
    required: [true, 'Please provide an image'],
    trim: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Please provide a room id'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
  },
  startTime: {
    type: Date,
    required: [true, 'Please provide a start time'],
  },
  endTime: {
    type: Date,
    required: [true, 'Please provide an end time'],
  },
});

movieSchema.plugin(idvalidator);

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
