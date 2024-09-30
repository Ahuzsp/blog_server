const User = require('../models/user');
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
    const query = req.query;
    const users = await User.find(query);
    res.json({
      code: 0,
      message: '查询成功',
      data: users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {

  // 检查必需字段是否存在
  const { userId, username, password } = req.body;
  // 创建新的用户对象
  const user = new User({
    userId,
    username,
    password
  });

  try {
    const newUser = await user.save();
    res.status(200).json({
      code: 0,
      message: '用户创建成功',
      data: newUser
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createUserBatch = async (req, res) => {

  // 检查必需字段是否存在
  const { userList } = req.body;
  console.log(userList, 'userList');
  
  try {
    const newUser = await User.insertMany(userList);
    res.status(200).json({
      code: 0,
      message: '用户批量创建成功',
      data: newUser
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};