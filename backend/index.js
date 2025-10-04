
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// Connect to database
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/products', require('./routes/productRoutes.js'));
app.use('/api/categories', require('./routes/categories.js'));
app.use('/api/auth', require('./routes/authRoutes.js'));
// Buyer routes (purchase) - keep /api/buy
app.use('/api/buy', require('./routes/buy.js'));
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
