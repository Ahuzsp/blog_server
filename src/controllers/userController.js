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
  const { username, password } = req.body

  try {
    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({
        code: 1,
        message: '用户名已存在'
      })
    }

    // 创建新的用户对象
    const user = new User({
      username,
      password
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
        code: 0,
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
    if (isFollow) {
      const doc = new Follow({
        userId,
        followUserId,
        createTime: new Date().toLocaleString().replace(/\//g, '-')
      })
      await doc.save()
      res.json({
        code: 0,
        message: '关注成功',
        data: true
      })
    } else {
      await Follow.deleteOne({ userId, followUserId })
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
      userId: { $in: followDocs.map((item) => item.userId) }
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
async function getLastUserId() {
  const lastUser = await User.find().sort({ userId: -1 }).limit(1)
  const lastUserId = lastUser.length > 0 ? lastUser[0].userId : null

  console.log(`The last userId is ${lastUserId}`)
}
