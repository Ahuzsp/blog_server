const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { versionKey: false });

userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

module.exports = mongoose.model('User', userSchema, 'user');