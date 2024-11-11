const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const defaultAvatars = [
  'https://i.ibb.co/nL4JPtw/dog.jpg',
  'https://i.ibb.co/4Jhg4kY/v2-1e38bd1c8d1ed41223c96c73cb899cd8-r.jpg'
]

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    abstract: {
      type: String,
      required: false
    },
    password: {
      type: String,
      required: true
    },
    authorAvatar: {
      type: String,
      default: defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)]
    },
    createTime: {
      type: String,
      default: new Date().toLocaleString().replace(/\//g, '-'),
      required: true
    }
  },
  { versionKey: false }
)

userSchema.plugin(AutoIncrement, { inc_field: 'userId' })

module.exports = mongoose.model('User', userSchema, 'user')
