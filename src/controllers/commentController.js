const commentModel = require('../models/comment')
const articleModel = require('../models/article')
exports.getCommentsByArticleId = async (req, res) => {
  try {
    const comments = await commentModel.aggregate([
      {
        $match: req.body
      },
      {
        $lookup: {
          from: 'user', // collection name
          localField: 'userId', // field in Article collection
          foreignField: 'userId', // field in User collection
          as: 'commentUser' // output field
        }
      },
      {
        $lookup: {
          from: 'user',
          localField: 'replyUserId',
          foreignField: 'userId',
          as: 'replyUser'
        }
      },
      {
        $unwind: '$commentUser'
      },
      // 这里如果使用了$unwind: '$replyUser',那么如果replyUser为空的话查出的comments也会为空
      // {
      //   $unwind: '$replyUser'
      // },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$$ROOT',
              {
                username: '$commentUser.username',
                authorAvatar: '$commentUser.authorAvatar',
                replyUsername: {
                  $ifNull: [{ $arrayElemAt: ['$replyUser.username', 0] }, '']
                },
                replyAuthorAvatar: {
                  $ifNull: [
                    { $arrayElemAt: ['$replyUser.authorAvatar', 0] },
                    ''
                  ]
                }
              }
            ]
          }
        }
      },
      {
        $unset: 'commentUser'
      },
      {
        $unset: 'replyUser'
      },
      {
        $sort: { createTime: -1 }
      }
    ])

    res.status(200).json({
      code: 0,
      message: '查询成功',
      data: comments
    })
  } catch (error) {
    console.log(error)

    res.status(400).json({
      code: 1,
      message: error.message || '查询失败',
      data: error
    })
  }
}

exports.createComment = async (req, res) => {
  try {
    const { articleId } = req.body
    const createTime = new Date().toLocaleString().replace(/\//g, '-')
    const comment = new commentModel({
      ...req.body,
      createTime,
      updateTime: createTime
    })

    await comment.save()
    // 更新文章的评论数
    const articleDoc = await articleModel.findOne({ articleId })
    await articleModel.updateOne(
      { articleId },
      { commentCount: articleDoc['commentCount'] + 1 }
    )
    res.status(200).json({
      code: 0,
      message: '添加成功',
      data: comment
    })
  } catch (error) {
    res.status(500).json({
      code: 1,
      message: '添加失败',
      data: error
    })
  }
}

exports.deleteComment = async (req, res) => {
  try {
    const { _id, articleId } = req.body
    // 先删除本条评论，再删除本条评论下的所有回复
    await commentModel.findByIdAndDelete(_id)
    const delRes = await commentModel.deleteMany({ parentId: _id })

    // // 更新文章的评论数
    const articleDoc = await articleModel.findOne({ articleId })
    const delCount = delRes.deletedCount + 1
    if (articleDoc['commentCount'] >= delCount) {
      await articleModel.updateOne(
        { articleId },
        { commentCount: articleDoc['commentCount'] - delCount }
      )
    }
    res.status(200).json({
      code: 0,
      message: '删除成功',
      data: null
    })
  } catch (error) {
    res.status(400).json({
      code: -1,
      message: '删除失败',
      data: error
    })
  }
}
