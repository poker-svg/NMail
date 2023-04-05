/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-04-05 14:43:41
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-05 16:16:56
 * @FilePath: \NMail\server\router\friend.js
 * @Description: 朋友模块的路由
 */
const express = require("express");
const router = express.Router();

// 导入朋友路由处理函数模块
const friendHandler = require("../router_handler/friend");

// 导入数据验证中间件
const expressJoi = require("@escook/express-joi");
// 导入朋友数据验证规则
const {
  add_friend_schema,
  get_all_friends_schema,
  get_friend_by_id_schema,
} = require("../schema/friend");

// 添加新朋友
router.post(
  "/add",
  expressJoi(add_friend_schema),
  friendHandler.addFriendHandler
);

// 获取某用户的朋友列表
router.get(
  "/get/all",
  expressJoi(get_all_friends_schema),
  friendHandler.getAllFriendsHandler
);

// 根据朋友id获取某特定用户的信息
router.get(
  "/get/id",
  expressJoi(get_friend_by_id_schema),
  friendHandler.getFriendByIdHandler
);

// 向外暴露路由
module.exports = router;
