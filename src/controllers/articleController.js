const Article = require('../models/article')
const Collect = require('../models/collect')
const Like = require('../models/like')
const User = require('../models/user')
const Follow = require('../models/follow')
exports.getArticles = async (req, res) => {
  try {
    const query = req.query
    const articles = await Article.find(query)

    res.json({
      code: 0,
      message: '查询成功',
      data: articles
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getArticleDetailById = async (req, res) => {
  const { _id } = req.query
  if (!_id) {
    return res.status(400).json({
      code: 1,
      message: '参数错误'
    })
  }
  try {
    const query = req.query
    const article = await Article.findById(query._id)
    // 这是因为 Mongoose 的文档对象（document）有一个 _doc 属性，它包含了文档的原始数据。Object.assign() 方法会将 _doc 属性拷贝到新的对象中。
    const articleData = article.toObject()
    const { userId, articleId } = article
    const user = await User.findOne({ userId })
    // 查询或否收藏
    // const collectIns = await Collect.findOne({ userId, articleId })
    const { authorAvatar, username, createTime } = user
    res.json({
      code: 0,
      message: '查询成功',
      data: Object.assign(
        { authorAvatar, username, createTime, isCollect: false },
        articleData
      )
    })
  } catch (err) {
    console.log(err)
    res.json({
      code: -1,
      message: '文章不存在',
      data: null
    })
  }
}
exports.createArticle = async (req, res) => {
  // 创建新的文章对象
  const article = new Article(req.body)

  try {
    const newArticle = await article.save()
    res.status(200).json({
      code: 0,
      message: '文章创建成功',
      data: newArticle
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.createArticleBatch = async (req, res) => {
  // 检查必需字段是否存在
  const { articleList } = req.body
  console.log(articleList, 'userList')

  try {
    const newUser = await User.insertMany(articleList)
    res.status(200).json({
      code: 0,
      message: '文章批量创建成功',
      data: newUser
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.collectOrLikeArticle = async (req, res) => {
  try {
    const { userId, articleId, type, isAction } = req.body
    const model = type === 'collect' ? Collect : Like

    const actionLabel = type === 'collect' ? '收藏' : '点赞'
    const actionKey = type === 'collect' ? 'collectCount' : 'likeCount'
    const existingDoc = await model.findOne({ userId, articleId })
    const articleDoc = await Article.findOne({ articleId })
    if (existingDoc && isAction) {
      res.status(200).json({
        code: -1,
        message: `不能重复${actionLabel}`,
        data: null
      })
    } else if (!existingDoc && !isAction) {
      res.status(200).json({
        code: -1,
        message: `没有${actionLabel}记录`,
        data: null
      })
    } else {
      if (isAction) {
        const doc = new model({
          userId,
          articleId,
          createTime: new Date().toLocaleString().replace(/\//g, '-')
        })
        await doc.save()
        // 更新文章的收藏数
        await Article.updateOne(
          { articleId },
          { [actionKey]: articleDoc[actionKey] + 1 }
        )
        res.status(200).json({
          code: 0,
          message: `${actionLabel}成功`,
          data: null
        })
      } else {
        await model.findByIdAndDelete(existingDoc._id)
        // 更新文章的收藏数
        if (articleDoc[actionKey] - 1 > 0) {
          await Article.updateOne(
            { articleId },
            { [actionKey]: articleDoc[actionKey] - 1 }
          )
        }
        res.status(200).json({
          code: 0,
          message: `取消${actionLabel}成功`,
          data: null
        })
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message })
  }
}
// 根据用户id和文章id获取用户收藏点赞状态
exports.getCollectAndLikeStatus = async (req, res) => {
  try {
    const { userId, articleId = null, followUserId = null } = req.body
    if (followUserId) {
      const followIns = await Follow.findOne({ userId, followUserId })
      res.status(200).json({
        code: 0,
        message: '查询成功',
        data: { isFollow: !!followIns }
      })
    } else {
      const collectIns = await Collect.findOne({ userId, articleId })
      const likeIns = await Like.findOne({ userId, articleId })
      res.status(200).json({
        code: 0,
        message: '查询成功',
        data: { isCollect: !!collectIns, isLike: !!likeIns }
      })
    }
  } catch (err) {
    console.log(err)

    res.status(500).json({ message: err.message })
  }
}
