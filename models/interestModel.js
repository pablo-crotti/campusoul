import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
});

const Interest = mongoose.model('Interest', interestSchema);

export default Interest;