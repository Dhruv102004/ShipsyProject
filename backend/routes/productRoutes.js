
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductsPublic,
  setProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  searchProducts, // import the new controller
} = require('../controllers/productController');
const { protect, isSeller } = require('../middleware/authMiddleware');

// Public listing (used by frontend buyer views)
router.route('/').get(getProductsPublic).post(protect, isSeller, setProduct);

// Add a new route for searching products
router.route('/search').get(searchProducts);

// Additional seller listing endpoint (must be before '/:id' to avoid being captured by the param)
router.route('/seller').get(protect, isSeller, getProducts);

// Backwards-compatible seller endpoints for single-product operations
router
  .route('/:id')
  .get(protect, isSeller, getProduct)
  .put(protect, isSeller, updateProduct)
  .delete(protect, isSeller, deleteProduct);

module.exports = router;
