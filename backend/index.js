
const express = require('express');
const connectDB = require('./db');
const app = express();
const port = process.env.PORT || 3001;

// Connect to database
connectDB();

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
