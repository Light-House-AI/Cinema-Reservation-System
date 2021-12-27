const mongoose = require('mongoose');

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
  },
  seatNumber: {
    type: Number,
    required: [true, 'Please provide a seat number'],
  },
});

ticketSchema.index(
  { movieId: 1, rowNumber: 1, seatNumber: 1 },
  { unique: true }
);

ticketSchema.plugin(idvalidator);

Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
