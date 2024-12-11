const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const clanSchema = new mongoose.Schema(
  {
    fullInfo: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    parentId: {
      type: Number,
      required: false
    },
    gender: {
      type: Number,
      required: true
    },
    spouse: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: false
    },
    deceased: {
      type: Boolean,
      required: false
    },
    graveAddress: {
      type: String,
      required: false
    },
    briefIntroduction: {
      type: String,
      required: false
    },
    createTime: {
      type: Number,
      required: true
    },
    updateTime: {
      type: Number,
      required: true
    }
  },
  { versionKey: false }
)

clanSchema.plugin(AutoIncrement, { inc_field: 'id' })

module.exports = mongoose.model('Clan', clanSchema, 'clan')
