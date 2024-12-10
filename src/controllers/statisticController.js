const Statistic = require('../models/statistic')
exports.logger = async (req, res) => {
	try {
		const st = new Statistic(req.body)
		const result = await st.save()
		res.status(200).json({
			code: 0,
			message: '日志上报成功',
			data: result
		})
	} catch (error) {
		res.status(500).json({
			code: 1,
			message: '日志上报失败',
			data: error
		})
	}
}
exports.getLogs = async (req, res) => {
	try {
		const query = req.query
		const st = await Statistic.find(query)
		res.status(200).json({
			code: 0,
			message: '日志查询成功',
			data: st
		})
	} catch (error) {
		res.status(500).json({
			code: 1,
			message: '日志查询失败',
			data: error
		})
	}
}
