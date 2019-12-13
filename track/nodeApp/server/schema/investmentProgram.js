const mongoose = require('mongoose');

const investmentProgramSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  investment_program_name: { type: mongoose.Schema.Types.ObjectId, ref: 'Investment', required: true },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model('InvestmentProgram', investmentProgramSchema);
