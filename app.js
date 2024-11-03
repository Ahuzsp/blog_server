const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db.js');
const userRoutes = require('./src/routes/userRoutes.js');
const articleRoutes = require('./src/routes/articleRoutes.js');
const logRoutes = require('./src/routes/logRoutes.js');
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
app.use('/api/articles', articleRoutes);
app.use('/api/logs', logRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app