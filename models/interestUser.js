import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const interestUserSchema = new Schema({
    interest_id: { type: Schema.Types.ObjectId, ref: 'Interest' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('InterestUser', interestUserSchema);