import mysql from "mysql2"
import config from "../config/index.config.js"

const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})
// console.log(config.host)

connection.connect((error) => {
  if (error) {
    console.log("Database connection failed : " + error.message)
    return
  }
  console.log("Connect to Mysql Database")
})

export default connection