const mysql = require('mysql2/promise')
require('dotenv').config()

let connectionInstance

const connectDB = async () => {
  if (connectionInstance) {
    return connectionInstance
  }

  try {
    connectionInstance = await mysql.createConnection({
      host: process.env.MYSQL_DB_HOST,
      user: process.env.MYSQL_DB_USER, // 确保这里是MYSQL_DB_USER而不是MYSQL_DB_NAME
      port: process.env.MYSQL_DB_PORT,
      password: process.env.MYSQL_DB_PASSWORD,
      database: process.env.MYSQL_DB_DATABASE
    })
    console.log('MySQL connected')
    return connectionInstance
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

module.exports = connectDB
