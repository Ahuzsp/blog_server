const User = require('../models/user')
const Collect = require('../models/collect')
const Like = require('../models/like')
const Follow = require('../models/follow')
const Article = require('../models/article')

// $eq: 等于
// $ne: 不等于
// $gt: 大于
// $gte: 大于等于
// $lt: 小于
// $lte: 小于等于
// $in: 在数组内
// $nin: 不在数组内
// 如果你还需要对结果进行排序、限制返回的条目数量或进行分页，可以使用链式方法，例如 .sort()、.limit() 和 .skip()：
// const users = await User.find({ age: { $gt: 18 } }).sort({ age: 1 }).limit(10).skip(20);
exports.getUsers = async (req, res) => {
	try {
		// getLastUserId();
		const query = req.query
		const users = await User.find(query)
		res.json({
			code: 0,
			message: '查询成功',
			data: users
		})
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}

exports.createUser = async (req, res) => {
	const { username, password, abstract, phone } = req.body

	try {
		// 检查用户名是否已存在
		const existingUser = await User.findOne({ username })
		if (existingUser) {
			return res.status(200).json({
				code: 0,
				data: null,
				message: '用户名已存在'
			})
		}
		const createTime = new Date().toLocaleString('zh-CN').replace(/\//g, '-')
		const updateTime = new Date().toLocaleString('zh-CN').replace(/\//g, '-')
		// 创建新的用户对象
		const user = new User({
			username,
			password,
			phone,
			createTime,
			updateTime,
			authorAvatar: 'https://i.ibb.co/PgRxm1c/image-png.png',
			abstract: abstract || '这个人很懒，什么都没留下'
		})

		const newUser = await user.save()
		res.status(200).json({
			code: 0,
			message: '用户创建成功',
			data: newUser
		})
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
}
exports.login = async (req, res) => {
	const { username, password } = req.body
	try {
		const user = await User.findOne({ username, password })
		if (user) {
			res.status(200).json({
				code: 0,
				message: '登录成功',
				data: user
			})
		} else {
			res.status(200).json({
				code: -1,
				message: '用户名或密码错误'
			})
		}
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
}
exports.createUserBatch = async (req, res) => {
	const { userList } = req.body
	try {
		const newUser = await User.insertMany(userList)
		res.status(200).json({
			code: 0,
			message: '用户批量创建成功',
			data: newUser
		})
	} catch (err) {
		res.status(400).json({ message: err.message })
	}
}
// 关注用户
exports.followUser = async (req, res) => {
	const { userId, followUserId, isFollow } = req.body
	try {
		const existingDoc = await Collect.findOne({ userId, followUserId })
		if (isFollow) {
			if (existingDoc) {
				return res.status(200).json({
					code: -1,
					data: null,
					message: '不能重复关注'
				})
			}
			const doc = new Follow({
				userId,
				followUserId,
				createTime: new Date().toLocaleString('zh-CN').replace(/\//g, '-')
			})
			await doc.save()
			res.json({
				code: 0,
				message: '关注成功',
				data: true
			})
		} else {
			await Follow.findByIdAndDelete(existingDoc._id)
			res.json({
				code: 0,
				message: '取消关注成功',
				data: false
			})
		}
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}
// 获取用户收藏点赞关注列表
exports.getUserActionList = async (req, res) => {
	try {
		console.time('getUserActionList')
		const { userId } = req.query
		const collectDocs = await Collect.find({ userId })
		const likeDocs = await Like.find({ userId })
		const followDocs = await Follow.find({ userId })
		// 通过articleId从文章表中查出所有点赞和收藏的文章
		const collectList = await Article.find({
			articleId: { $in: collectDocs.map((item) => item.articleId) }
		})
		const likeList = await Article.find({
			articleId: { $in: likeDocs.map((item) => item.articleId) }
		})
		const followList = await User.find({
			userId: { $in: followDocs.map((item) => item.followUserId) }
		})
		console.timeEnd('getUserActionList')
		res.json({
			code: 0,
			message: '查询成功',
			data: {
				collectList,
				likeList,
				followList
			}
		})
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}
// 修改用户信息
exports.updateUser = async (req, res) => {
	try {
		const { userId } = req.body
		if (!userId) {
			return res.status(400).json({
				code: 1,
				message: '参数错误'
			})
		}
		const user = await User.findOne({ userId })
		if (!user) {
			return res.status(400).json({
				code: 1,
				message: '用户不存在'
			})
		}
		Object.keys(req.body).forEach((key) => {
			if (key !== 'userId') {
				user[key] = req.body[key]
			}
		})
		user.updateTime = new Date().toLocaleString('zh-CN').replace(/\//g, '-')
		await user.save()
		res.json({
			code: 0,
			message: '用户信息修改成功',
			data: user
		})
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}
// 上传图片
exports.uploadImage = async (req, res) => {
	try {
		const { fileName, formData } = req.body
		axios
			.post(
				`https://api.imgbb.com/1/upload?name=${fileName}&key=bca48a62e1fd90fb1922e832723a02f2`,
				formData
			)
			.then((response) => {
				res.json({
					code: 0,
					message: '上传成功',
					data: response.data
				})
			})
			.catch((error) => {
				res.status(500).json({ message: error.message })
			})
	} catch (err) {
		res.status(500).json({ message: err.message })
	}
}
async function getLastUserId() {
	const lastUser = await User.find().sort({ userId: -1 }).limit(1)
	const lastUserId = lastUser.length > 0 ? lastUser[0].userId : null

	console.log(`The last userId is ${lastUserId}`)
}
