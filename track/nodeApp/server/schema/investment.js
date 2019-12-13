const mongoose = require('mongoose');

const investmentSchema = mongoose.Schema({
  name: { type: String, required: true },
  total_budget: {  type: Number,default:0, required: true },
});

module.exports = mongoose.model('Investment', investmentSchema);
