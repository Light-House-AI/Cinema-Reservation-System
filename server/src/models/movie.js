const mongoose = require('mongoose');

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
    image: {
      type: String,
      default: 'images/default.jpg',
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

movieSchema.virtual('seats', {
  ref: 'Ticket',
  localField: '_id',
  foreignField: 'movieId',
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
