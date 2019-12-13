const mongoose = require('mongoose');

const sectionPlanSchema = mongoose.Schema({
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  year: { type: String, required: true },
  amount: { type: String, required: true },

});

module.exports = mongoose.model('SectionPlan', sectionPlanSchema);
