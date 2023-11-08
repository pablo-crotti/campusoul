import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  matchedAt: {
    type: Date,
    default: Date.now
  },
  isMatchActive: {
    type: Boolean,
    default: true
  }
});

const Match = mongoose.model('Match', matchSchema);

export default Match;
