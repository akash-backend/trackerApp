const mongoose = require('mongoose');

const planSchema = mongoose.Schema({
  name: { type: String, required: true },
  section: { type: Number, required: true },
});

module.exports = mongoose.model('Plan', planSchema);
