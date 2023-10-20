import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const interestUserSchema = new mongoose.Schema({
    interest_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Interest' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('InterestUser', interestUserSchema);