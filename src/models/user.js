const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true // 设置唯一索引
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema, 'user');