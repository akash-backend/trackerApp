const mongoose = require('mongoose');

const constructionProgramSchema = mongoose.Schema({
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Investment' },
  constructionId: { type: String , required: true },
});

module.exports = mongoose.model('ConstructionProgram', constructionProgramSchema);