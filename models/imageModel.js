const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  // URL de l'image sur S3
  url: {
    type: String,
    required: true
  },
  // Date de création de l'image
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
