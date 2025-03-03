const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  conversation: [{
    role: String,
    content: String,
    timestamp: Date,
  }],
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: Date,
  duration: Number,
}, {
  timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;