const mongoose = require('mongoose');
const idvalidator = require('mongoose-id-validator');

const ticketSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Please provide a movie id'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user id'],
  },
  rowNumber: {
    type: Number,
    required: [true, 'Please provide a row number'],
    min: [1, 'Row numbers starts at 1'],
  },
  seatNumber: {
    type: Number,
    required: [true, 'Please provide a seat number'],
    min: [1, 'Seat numbers starts at 1'],
  },
});

ticketSchema.index(
  { movieId: 1, rowNumber: 1, seatNumber: 1 },
  { unique: true }
);

ticketSchema.plugin(idvalidator);

ticketSchema.virtual('movie', {
  ref: 'Movie',
  localField: 'movieId',
  foreignField: '_id',
});

Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
