import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    user_1_id: { type: Schema.Types.ObjectId, ref: 'User' },
    user_2_id: { type: Schema.Types.ObjectId, ref: 'User' },
    user_1_status: Number,
    user_2_status: Number
  });

export default mongoose.model('Match', matchSchema);