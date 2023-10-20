import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    match_id: { type: Schema.Types.ObjectId, ref: 'Match' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    message: String,
    read: Boolean
});

export default mongoose.model('Message', messageSchema);