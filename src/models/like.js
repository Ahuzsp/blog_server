const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true
    },
    articleId: {
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

likeSchema.plugin(AutoIncrement, { inc_field: 'likeId' })

module.exports = mongoose.model('Like', likeSchema, 'like')
