
const Product = require('../models/productModel');

// @desc    Get products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user.id });
  res.status(200).json(products);
};

// @desc    Set product
// @route   POST /api/products
// @access  Private
const setProduct = async (req, res) => {
  console.log('req.body', req.body);
  console.log('req.user', req.user);
  const { productName, category, costPrice, quantity, isFeatured, taxRate } = req.body;

  if (!productName || !category || !costPrice || !quantity || !taxRate) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    const product = await Product.create({
      productName,
      category,
      costPrice,
      quantity,
      isFeatured,
      taxRate,
      seller: req.user.id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  console.log('req.params.id', req.params.id);
  console.log('req.body', req.body);
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the product user
    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  console.log('req.params.id', req.params.id);
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(400).json({ message: 'Product not found' });
    }

    // Check for user
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Make sure the logged in user matches the product user
    if (product.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await product.remove();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProducts,
  setProduct,
  updateProduct,
  deleteProduct,
};
