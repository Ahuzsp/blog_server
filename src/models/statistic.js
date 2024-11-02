const mongoose = require('mongoose');

const statisticSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
  },
  ip: {
    type: String,
    required: true,
  },
  device: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('Statistic', statisticSchema, 'statistic');