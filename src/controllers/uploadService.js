const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

const apiKey = 'bca48a62e1fd90fb1922e832723a02f2'

async function uploadToImgBB(filePath, fileName) {
  const url = `https://api.imgbb.com/1/upload?name=${fileName}&key=${apiKey}`

  const formData = new FormData()
  formData.append('image', fs.createReadStream(filePath))

  try {
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders()
      }
    })
    return response.data
  } catch (error) {
    throw new Error('Failed to upload image')
  } finally {
    fs.unlinkSync(filePath) // 删除临时文件
  }
}

module.exports = { uploadToImgBB }
