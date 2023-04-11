/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-31 09:32:15
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-11 09:08:07
 * @FilePath: \NMail\server\router\user.js
 * @Description: 用户的路由模块
 */
const express = require("express");
const router = express.Router();

// 导入用户路由处理函数模块
const userHandler = require("../router_handler/user");

// 导入数据验证中间件
const expressJoi = require("@escook/express-joi");
// 导入用户数据验证规则
const { reg_login_schema } = require("../schema/user");

// 注册新用户
router.post(
  "/reguser",
  expressJoi(reg_login_schema),
  userHandler.regUserHandler
);

// 登录
router.post("/login", expressJoi(reg_login_schema), userHandler.loginHandler);

// 验证码
router.get("/captcha", userHandler.captchaHandler);

// 向外暴露路由
module.exports = router;
