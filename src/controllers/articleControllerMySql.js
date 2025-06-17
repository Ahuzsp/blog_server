const mysqlDb = require('../config/mysqlDb')
const moment = require('moment')

exports.getArticles = async (req, res) => {
	let { category = '', keyword = '', userId = 0 } = req.query
	try {
		const pool = await mysqlDb()
		let query = `
      SELECT * FROM article
      WHERE 1=1
    `
		const queryParams = []

		if (category && category != -1) {
			query += ` AND category = ?`
			queryParams.push(+category)
		}
		if (userId) {
			query += ` AND userId = ?`
			queryParams.push(userId)
		}
		const keywordLike = `%${keyword}%`
		if (keyword) {
			query += ` AND (
      articleTitle LIKE ? OR
      description LIKE ? OR
      mdValue LIKE ?
    )`
			queryParams.push(keywordLike, keywordLike, keywordLike)
		}

		const [rows] = await pool.query(query, queryParams)
		res.status(200).json({
			code: 0,
			message: '查询成功',
			data: rows
		})
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

exports.getArticleDetailById = async (req, res) => {
	const { id } = req.query
	if (!id) {
		return res.status(400).json({
			code: 1,
			message: '参数错误'
		})
	}
	try {
		const pool = await mysqlDb()
		const [rows] = await pool.query(
			'SELECT * FROM article WHERE articleId = ?',
			[id]
		)
		res.status(200).json({
			code: 0,
			message: '查询成功',
			data: rows[0]
		})
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

exports.deleteArticleById = async (req, res) => {
	try {
		const { articleId } = req.body
		const pool = await mysqlDb()
		await pool.query('DELETE FROM article WHERE articleId = ?', [articleId])
		res.status(200).json({
			code: 0,
			message: '删除成功',
			data: null
		})
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

exports.addOrUpdateArticle = async (req, res) => {
	try {
		const {
			articleId,
			userId,
			articleTitle,
			cover,
			category,
			description,
			mdValue
		} = req.body
		const pool = await mysqlDb()
		const now = moment().format('YYYY-MM-DD HH:mm:ss')
		if (articleId) {
			await pool.query(
				'UPDATE article SET articleTitle = ?, userId = ?, category = ?, description = ?, mdValue = ?, updateTime = ? WHERE articleId = ?',
				[
					articleTitle,
					userId,
					cover,
					category,
					description,
					mdValue,
					articleId,
					now
				]
			)
			res.status(200).json({
				code: 0,
				message: '文章更新成功',
				data: null
			})
			return
		} else {
			await pool.query(
				'INSERT INTO article (articleTitle, userId, category, description, mdValue, createTime, updateTime) VALUES (?, ?, ?, ?, ?, ?, ?)',
				[articleTitle, userId, category, description, mdValue, now, now]
			)
			res.status(200).json({
				code: 0,
				message: '文章添加成功',
				data: null
			})
		}
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}
