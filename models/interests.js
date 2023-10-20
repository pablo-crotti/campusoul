import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const interestSchema = new mongoose.Schema({
    title: String,
    icon: String
});

export default mongoose.model('Interest', interestSchema);