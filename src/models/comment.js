const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema(
  {
    createTime: {
      type: String,
      required: true
    },
    updateTime: {
      type: String,
      required: true
    },
    articleId: {
      type: Number,
      required: true
    },
    userId: {
      type: Number,
      required: true
    },
    replyUserId: {
      type: Number,
      required: false
    },
    replyCommentId: {
      type: String,
      required: false
    },
    parentId: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: true
    },
    imgUrl: {
      type: String,
      required: false
    }
  },
  { versionKey: false }
)
module.exports = mongoose.model('Comment', commentSchema, 'comment')
