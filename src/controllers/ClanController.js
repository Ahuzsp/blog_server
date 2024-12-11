const ClanModel = require('../models/clan')
exports.getClanMembers = async (req, res) => {
  console.time('getClanMembers')
  try {
    const data = await ClanModel.find()
    res.json({
      code: 0,
      message: '查询成功',
      data
    })
    console.timeEnd('getClanMembers')
  } catch (error) {
    res.json({
      code: -1,
      message: error.message || '查询失败',
      data: null
    })
  }
}
exports.createClanMember = async (req, res) => {
  try {
    const time = new Date().getTime()
    const data = await ClanModel.create({
      ...req.body,
      createTime: time,
      updateTime: time
    })
    res.json({
      code: 0,
      message: '人物创建成功',
      data
    })
  } catch (error) {
    res.json({
      code: -1,
      message: error.message || '创建失败',
      data: null
    })
  }
}
exports.batchCreateMembers = async (req, res) => {
  try {
    const { clanList } = req.body
    await ClanModel.insertMany(clanList)
    res.json({
      code: 0,
      message: '人物批量创建成功',
      data: null
    })
  } catch (error) {
    res.json({
      code: -1,
      message: error.message || '批量创建失败',
      data: null
    })
  }
}
