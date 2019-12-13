const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  product_number: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);
