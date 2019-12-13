const mongoose = require('mongoose');

const manageCategorySchema = mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true }
});

module.exports = mongoose.model('ManageCategory', manageCategorySchema);
