const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ categories });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
