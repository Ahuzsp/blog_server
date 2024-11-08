const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const collectSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
    },
    articleId: {
        type: Number,
        required: true,
    },
    createTime: {
        type: String,
        default: new Date().toLocaleString().replace(/\//g, '-'),
        required: true,
    },
}, { versionKey: false });

collectSchema.plugin(AutoIncrement, { inc_field: 'collectId' });

module.exports = mongoose.model('Collect', collectSchema, 'collect');
