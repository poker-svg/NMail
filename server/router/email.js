/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-04-02 14:42:50
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-02 18:48:49
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

// 读取收件箱中邮件的路由
router.get("/read/received", email_handler.read_receiveMail);

module.exports = router;
