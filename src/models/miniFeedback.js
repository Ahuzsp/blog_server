const mongoose = require('mongoose')
const MiniFeedbackScheme = new mongoose.Schema(
	{
		userId: {
			type: Number,
			required: true
		},
		errorInfo: {
			type: String,
			required: true
		},
		img: {
			type: String,
			required: false
		}
	},
	{ versionKey: false }
)
module.exports = mongoose.model(
	'MiniFeedback',
	MiniFeedbackScheme,
	'miniFeedback'
)
