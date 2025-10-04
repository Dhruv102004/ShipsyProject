
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

    // Calculate unit selling price including tax
    const unitSellingPrice = product.costPrice * (1 + (product.taxRate || 0) / 100);
    let sellingPrice = unitSellingPrice * quantity;

    // Apply 5% discount on sellingPrice if product is featured
    let discountApplied = false;
    if (product.isFeatured) {
      sellingPrice = Number((sellingPrice * 0.95).toFixed(2));
      discountApplied = true;
    } else {
      sellingPrice = Number(sellingPrice.toFixed(2));
    }

    product.quantity -= quantity;
    await product.save();

    res.status(200).json({ sellingPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  buyProduct,
};
