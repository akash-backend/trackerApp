const mongoose = require('mongoose');

const journalSchema = mongoose.Schema({
  construction: { type: mongoose.Schema.Types.ObjectId, ref: 'Construction' },
  explanation: {
        type: String,
        required: true
  },
  journaldDate: {
        type: String,
        required: true
  },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
  amount: {
        type: Number,
        required: true
  },
  actualCost: {
        type: Number,
        required: true
  },
  totlaAmount: {
        type: Number,
        required: true
   },
  amountType: {
        type: String,
        required: true
  },
  lastChange: {
        type: String,
        required: true
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Journal', journalSchema);