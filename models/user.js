import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    salt: String,
    token: String,
    birthdate: Date,
    bio: String,
    location: String,
    last_activity: Date,
    created_at: Date
});

export default mongoose.model('User', userSchema);