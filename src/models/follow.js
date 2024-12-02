const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const followSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true
    },
    followUserId: {
      type: Number,
      required: true
    },
    createTime: {
      type: String,
      required: true
    }
  },
  { versionKey: false }
)

followSchema.plugin(AutoIncrement, { inc_field: 'followId' })

module.exports = mongoose.model('Follow', followSchema, 'follow')
