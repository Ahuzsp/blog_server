const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db.js');
const userRoutes = require('./src/routes/userRoutes.js');
require('dotenv').config();

const app = express();
// 使用 cors 中间件
app.use(cors());
// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app