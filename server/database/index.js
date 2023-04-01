/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-31 13:03:16
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-03-31 13:06:41
 * @FilePath: \NMail\server\database\index.js
 * @Description: 后端服务器连接和控制数据库
 */
const mysql = require("mysql");

const database = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "admin123",
  database: "n-mail",
});

module.exports = database;
