/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-31 09:32:15
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-08 12:37:50
 * @FilePath: \NMail\server\router\user.js
 * @Description: 用户信息处理的路由模块
 */
const express = require("express");
const router = express.Router();

// 导入路由处理器模块
const userinfo_handler = require("../router_handler/userinfo");

// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入验证规则对象
const {
  update_userinfo_schema,
  update_password_schema,
  update_user_picture_schema,
} = require("../schema/user");

// 获取用户信息的路由
router.get("/userinfo", userinfo_handler.getUserInfo);
// 更新用户信息的路由
router.post(
  "/userinfo",
  expressJoi(update_userinfo_schema),
  userinfo_handler.updateUserInfo
);
// 更新用户密码的路由
router.post(
  "/updatepwd",
  expressJoi(update_password_schema),
  userinfo_handler.updatePwd
);
// 更新用户头像的路由
router.post(
  "/update/user_pic",
  expressJoi(update_user_picture_schema),
  userinfo_handler.updateUserPicture
);

// 向外暴露路由
module.exports = router;
