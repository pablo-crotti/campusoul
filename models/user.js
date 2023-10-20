import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Define the schema for users
const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    salt: String,
    token: String,
    birthdate: Date,
    bio: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    last_activity: Date,
    created_at: Date
});
// Create the model from the schema and export it
export default mongoose.model('User', userSchema);