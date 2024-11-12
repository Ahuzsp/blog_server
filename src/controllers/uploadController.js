const { uploadToImgBB } = require('./uploadService.js')
exports.uploadImage = async (req, res) => {
  const file = req.file
  const fileName = file.originalname

  try {
    const result = await uploadToImgBB(file.path, fileName)
    res.status(200).json({
      code: 0,
      message: `图片上传成功`,
      data: result.data
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
