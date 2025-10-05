
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Other'],
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
    min: [0.01, 'Price must be greater than 0'],
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  taxRate: {
    type: Number,
    default:5,
    min: 0,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Product', productSchema);
