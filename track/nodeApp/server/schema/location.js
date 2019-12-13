const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  site_name: { type: String, required: true },
  place: { type: String, required: true },

});

module.exports = mongoose.model('Location', locationSchema);
