const mysqlDb = require('../config/mysqlDb')
const moment = require('moment')
exports.getClanMembers = async (req, res) => {
  const pool = await mysqlDb()
  console.time('getClanMembers')
  try {
    const data = await pool.query('SELECT * FROM clan')
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
exports.updateClanMember = async (req, res) => {
  try {
    const { _id } = req.body
    const data = await ClanModel.findOneAndUpdate(
      { _id },
      { ...req.body, updateTime: new Date().getTime() }
    )
    res.json({
      code: 0,
      message: '人物修改成功',
      data
    })
  } catch (error) {
    res.json({
      code: -1,
      message: error.message || '修改失败',
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
