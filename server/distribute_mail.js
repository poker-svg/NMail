/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-04-04 13:25:36
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-04 17:47:12
 * @FilePath: \NMail\server\distribute_mail.js
 * @Description: 分发邮件模块
 */
// 导入数据库连接和控制模块
const database = require("./database/index");

function distributeMail(email) {
  if (!email) {
    console.log("Email is required");
    return;
  }

  const sender = email.sender;
  const title = email.subject;
  const content = email.content;
  console.log("content: " + content);

  // 插入邮件信息;
  // const insert_sqlStr = "insert into users set ?";
  // database.query(
  //   insert_sqlStr,
  //   { username: userinfo.username, password: userinfo.password },
  //   (err, results) => {
  //     if (err) {
  //       return res.response_data(err);
  //     }
  //     if (results.affectedRows !== 1) {
  //       return res.response_data("注册用户失败,请稍后重试!");
  //     }

  //     return res.response_data("注册用户成功!", 0);
  //   }
  // );
}

module.exports = {
  distributeMail,
};
