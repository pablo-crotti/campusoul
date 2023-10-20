import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const imgUserSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    img: String,
    position: Number
  });

export default mongoose.model('imgUser', imgUserSchema);