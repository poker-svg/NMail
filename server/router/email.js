/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-04-02 14:42:50
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-03 22:38:44
 * @FilePath: \NMail\server\router\email.js
 * @Description: email处理的路由模块
 */
const express = require("express");
const router = express.Router();

// 导入相应的处理函数模块
const email_handler = require("../router_handler/email");

// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入验证规则对象
const { send_email_schema } = require("../schema/email");

// 发送信件的路由
router.post("/send", expressJoi(send_email_schema), email_handler.sendEmail);

// 读取某用户收件箱中所有邮件的简略信息的路由
router.get("/read/received", email_handler.read_receiveMail);

// 读取收件箱中某特定邮件的详细信息的路由
router.get("/read/received/:id", email_handler.get_email_details);

// 删除收件箱中某特定邮件的路由
router.get("/delete/received/:id", email_handler.delete_email);

// 监听新邮件来临的路由
router.post("/listen", email_handler.listen_email);

module.exports = router;
