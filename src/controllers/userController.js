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
    getLastUserId();
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
  const { username, password } = req.body;

  try {
    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        code: 1,
        message: '用户名已存在'
      });
    }

    // 创建新的用户对象
    const user = new User({
      username,
      password
    });

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
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({
        code: 0,
        message: '登录成功',
        data: user
      });
    } else {
      res.status(200).json({
        code: 0,
        message: '用户名或密码错误'
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
exports.createUserBatch = async (req, res) => {
  const { userList } = req.body;
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
async function getLastUserId() {
  const lastUser = await User.find().sort({ userId: -1 }).limit(1);
  const lastUserId = lastUser.length > 0 ? lastUser[0].userId : null;

  console.log(`The last userId is ${lastUserId}`);
}