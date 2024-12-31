const MiniFeedback = require('../models/miniFeedback')
exports.createFeedback = async (req, res) => {
	const { userId, errorInfo, img } = req.body
	try {
		const createTime = new Date().toLocaleString('zh-CN').replace(/\//g, '-')
		const updateTime = new Date().toLocaleString('zh-CN').replace(/\//g, '-')
		const miniFeedback = new MiniFeedback({
			userId,
			errorInfo,
			img,
			createTime,
			updateTime
		})

		await miniFeedback.save()
		res.json({
			code: 0,
			message: '新增成功！',
			data: null
		})
	} catch (err) {
		res.json({
			code: -1,
			message: err?.message || '新增失败',
			data: null
		})
	}
}
