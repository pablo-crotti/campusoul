import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Define the schema for users
const userSchema = new Schema({
  name: String,
  mail: String
});
// Create the model from the schema and export it
export default mongoose.model('User', userSchema);