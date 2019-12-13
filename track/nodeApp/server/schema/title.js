const mongoose = require('mongoose');

const titleSchema = mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model('Title', titleSchema);