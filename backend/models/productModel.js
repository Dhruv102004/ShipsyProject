
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Electronics', 'Clothing', 'Books', 'Stationary', 'Other'],
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  taxRate: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Product', productSchema);
