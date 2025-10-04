
const express = require('express');
const router = express.Router();
const {
  getProducts,
  setProduct,
  updateProduct,
  deleteProduct,
  getProduct
} = require('../controllers/productController');
const { protect, isSeller } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, isSeller, getProducts)
  .post(protect, isSeller, setProduct);

router
  .route('/:id')
  .get(protect, isSeller, getProduct)
  .put(protect, isSeller, updateProduct)
  .delete(protect, isSeller, deleteProduct);

module.exports = router;
