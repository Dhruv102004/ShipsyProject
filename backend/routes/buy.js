const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // <--- import the function
const Product = require('../models/productModel');

router.post('/', protect, async (req, res) => {
  try {
    const { productName, quantity } = req.body;

    if (!productName || !quantity) {
      return res.status(400).json({ message: 'Product name and quantity are required' });
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number' });
    }

    const product = await Product.findOne({ productName });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < qty) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    // Calculate selling price: costPrice + tax
    const unitSellingPrice = product.costPrice * (1 + (product.taxRate || 0) / 100);
    const sellingPrice = Number((unitSellingPrice * qty).toFixed(2));

    // Calculate profit for seller: (sellingPrice - costPrice*qty)

    product.quantity -= qty;
    await product.save();

    return res.json({ sellingPrice });
  } catch (err) {
    console.error('Error in /api/buy route:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
