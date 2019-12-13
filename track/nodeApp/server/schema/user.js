const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  ressort: { type: mongoose.Schema.Types.ObjectId, ref: 'Ressort', required: true }
});

module.exports = mongoose.model('User', userSchema);
