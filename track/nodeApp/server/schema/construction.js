const mongoose = require('mongoose');

const constructionSchema = mongoose.Schema({
  name: { type: String},
  street: { type: String},
  azHMdFDeptIV: { type: String},
  projectNrPartner: { type: String },
  device: { type: Boolean },
  referenceToConstructionMeasure: { type: String},
  ActionCoordinator: { type: String },
  recordingDate: { type: String},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  ressort: { type: mongoose.Schema.Types.ObjectId, ref: 'Ressort' },
  section: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  constructionName:  { type: mongoose.Schema.Types.ObjectId, ref: 'Construction' },
  interiorRef: { type: String },
  title: { type: mongoose.Schema.Types.ObjectId, ref: 'Title'},
  relevantForMFP: { type: Boolean },
});

module.exports = mongoose.model('Construction', constructionSchema);
