
const express = require('express');
const router = express.Router();
const { buyProduct } = require('../controllers/buyerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/buy', protect, buyProduct);

module.exports = router;
