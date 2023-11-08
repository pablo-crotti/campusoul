import mongoose from 'mongoose';
import ENV from './env.js';

const { mongoURI } = ENV;
const { mongoDBName } = ENV;

mongoose.connect(mongoURI, {dbName: mongoDBName}, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

export default mongoose;
