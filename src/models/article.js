const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const articleSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    articleTitle: {
      type: String,
      required: true
    },
    createTime: {
      type: String,
      required: true
    },
    updateTime: {
      type: String,
      required: true
    },
    readCount: {
      type: Number,
      default: 0,
      required: true
    },
    commentCount: {
      type: Number,
      default: 0,
      required: true
    },
    likeCount: {
      type: Number,
      default: 0,
      required: true
    },
    collectCount: {
      type: Number,
      default: 0,
      required: true
    },
    category: {
      type: Number,
      required: true
    },
    abstract: {
      type: String,
      required: true
    },
    mdValue: {
      type: String,
      required: true
    },
    cover: {
      type: String,
      required: false
    }
  },
  { versionKey: false }
)
articleSchema.plugin(AutoIncrement, { inc_field: 'articleId' })
module.exports = mongoose.model('Article', articleSchema, 'article')
