const Collect = require('../models/collect')
const Like = require('../models/like')
const Follow = require('../models/follow')
const Article = require('../models/article')
const User = require('../models/user')
exports.getArticles = async (req, res) => {
  try {
    console.time('getArticles')
    const query = req.body
    let defaultQuery = [
      {
        $match: query
      },
      {
        $lookup: {
          from: 'user', // collection name
          localField: 'userId', // field in Article collection
          foreignField: 'userId', // field in User collection
          as: 'author' // output field
        }
      },
      {
        $unwind: '$author' // flatten the author array
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$$ROOT',
              {
                username: '$author.username',
                authorAvatar: '$author.authorAvatar',
                abstract: '$author.abstract'
              }
            ]
          }
        }
      },
      {
        $unset: 'author'
      }
    ]
    if (query.category === -1) {
      // 取点赞量最多的10条数据
      defaultQuery.splice(
        0,
        1,
        {
          $sort: { likes: -1 }
        },
        {
          $limit: 10
        }
      )
    }
    const articles = await Article.aggregate(defaultQuery)
    console.timeEnd('getArticles')
    res.json({
      code: 0,
      message: '查询成功',
      data: articles
    })
  } catch (err) {
    console.log(err)

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
    console.time('getArticleDetailById')
    const query = req.query
    const article = await Article.findById(query._id)
    const { userId } = article
    const user = await User.findOne({ userId })
    const { authorAvatar, username, createTime } = user
    res.json({
      code: 0,
      message: '查询成功',
      data: { ...article.toObject(), authorAvatar, username, createTime }
    })
    console.timeEnd('getArticleDetailById')
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
  const { _id } = req.body
  if (_id) {
    const editDoc = await Article.findById(_id)
    if (!editDoc) {
      return res.status(400).json({
        code: -1,
        message: '文章不存在或已被删除'
      })
    } else {
      // 更新文章
      Object.keys(req.body).forEach((key) => {
        if (key !== '_id') {
          editDoc[key] = req.body[key]
        }
      })
      editDoc.updateTime = new Date().toLocaleString().replace(/\//g, '-')
      await editDoc.save()
      res.json({
        code: 0,
        message: '文章修改成功',
        data: editDoc
      })
    }
    return
  }
  // 创建新的文章对象
  const createTime = new Date().toLocaleString().replace(/\//g, '-')
  const updateTime = new Date().toLocaleString().replace(/\//g, '-')
  const article = new Article({ ...req.body, createTime, updateTime })

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
// 删除文章
exports.deleteArticle = async (req, res) => {
  try {
    const { _id } = req.body
    await Article.findByIdAndDelete(_id)
    res.json({
      code: 0,
      message: '文章删除成功',
      data: null
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
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
