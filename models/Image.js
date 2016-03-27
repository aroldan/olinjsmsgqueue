var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
  original: String,
  createDate: Date,
  largeThumb: String,
  smallThumb: String
});

module.exports = mongoose.model('Image', imageSchema);