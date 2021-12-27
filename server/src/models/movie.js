const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');

const movieSchema = new mongoose.Schema(
  {
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
    roomId: {
      type: Number,
      required: [true, 'Please provide a room id'],
      min: [1, 'Room id must be 1 or 2'],
      max: [2, 'Room id must be 1 or 2'],
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSchema.plugin(idvalidator);

movieSchema.virtual('seats', {
  ref: 'Ticket',
  localField: '_id',
  foreignField: 'movieId',
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
