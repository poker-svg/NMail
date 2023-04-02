/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-04-02 14:42:50
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-02 14:53:33
 * @FilePath: \NMail\server\router\email.js
 * @Description: email处理的路由模块
 */
const express = require("express");
const router = express.Router();

// 导入相应的处理函数模块
const email_handler = require("../router_handler/email");

// 发送信件的路由
router.post("/send", email_handler.sendEmail);

module.exports = router;
