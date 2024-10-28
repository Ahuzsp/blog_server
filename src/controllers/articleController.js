const Article = require('../models/article');

exports.getArticles = async (req, res) => {
  try {
    const query = req.query;
    const users = await Article.find(query);
    res.json({
      code: 0,
      message: '查询成功',
      data: users
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createArticle = async (req, res) => {

  // 创建新的文章对象
  const article = new Article(req.body);

  try {
    const newArticle = await article.save();
    res.status(200).json({
      code: 0,
      message: '文章创建成功',
      data: newArticle
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createArticleBatch = async (req, res) => {

  // 检查必需字段是否存在
  const { articleList } = req.body;
  console.log(articleList, 'userList');
  
  try {
    const newUser = await User.insertMany(articleList);
    res.status(200).json({
      code: 0,
      message: '文章批量创建成功',
      data: newUser
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};