
const Product = require('../models/productModel');

// @desc    Buy a product
// @route   POST /api/buy
// @access  Private
const buyProduct = async (req, res) => {
  console.log('req.body', req.body);
  const { productName, quantity } = req.body;

  if (!productName || !quantity) {
    return res.status(400).json({ message: 'Please provide productName and quantity' });
  }

  try {
    const product = await Product.findOne({ productName });

    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock' });
    }

    const sellingPrice = product.costPrice * (1 + product.taxRate / 100) * quantity;

    res.status(200).json({ sellingPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  buyProduct,
};
