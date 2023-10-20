import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const imgUserSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    img: String,
    position: Number
});

export default mongoose.model('ImgUser', imgUserSchema);