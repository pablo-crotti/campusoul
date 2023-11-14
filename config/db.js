import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


mongoose.connect(process.env.MONGODB_URI, {dbName: process.env.MONGODB_NAME}, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

export default mongoose;
