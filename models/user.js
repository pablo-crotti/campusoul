import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String
    // password: String,
    // salt: String,
    // token: String,
    // birthdate: Date,
    // bio: String,
    // location: {
    //     type: {
    //         type: String,
    //         enum: ['Point'],
    //         required: true
    //     },
    //     coordinates: {
    //         type: [Number],
    //         required: true
    //     }
    // },
    // last_activity: Date,
    // created_at: Date
});

// userSchema.index({ location: '2dsphere' });
export default mongoose.model('User', userSchema);