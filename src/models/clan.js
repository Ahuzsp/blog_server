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
		generation: {
			type: Number,
			required: false
		},
		spouse: {
			type: String,
			required: false
		},
		address: {
			type: String,
			required: false
		},
		isDeceased: {
			type: Number,
			required: false,
			default: 0
		},
		isSpouseDeceased: {
			type: Number,
			required: false,
			default: 0
		},
		spouseGrave: {
			type: Array,
			items: {
				type: Object,
				properties: {
					address: { type: String },
					img: { type: String },
					desc: { type: String }
				}
			},
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
		graveImg: {
			type: String,
			required: false
		},
		spouseGraveImg: {
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
