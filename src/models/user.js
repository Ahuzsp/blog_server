const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

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
		phone: {
			type: Number,
			required: false
		},
		authorAvatar: {
			type: String,
			required: false
		},
		createTime: {
			type: String,
			required: true
		},
		updateTime: {
			type: String,
			required: true
		}
	},
	{ versionKey: false }
)

userSchema.plugin(AutoIncrement, { inc_field: 'userId' })

module.exports = mongoose.model('User', userSchema, 'user')
