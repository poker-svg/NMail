/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-31 09:11:09
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-01 21:29:41
 * @FilePath: \NMail\server\server.js
 * @Description: 服务器主入口
 */
// 导入express包
const express = require("express");
// 导入cors包
const cors = require("cors");
// 导入数据验证规则包
const joi = require("joi");

// 创建express的服务器实例
const server = express();

// 将cors注册为全局中间件
server.use(cors());

// 配置解析表单数据的中间件，这个中间件只能解析application/x-www-form-urlencoded
server.use(express.urlencoded({ extended: false }));

// 在res对象上挂载响应数据的函数
server.use((req, res, next) => {
  // status默认为1,代表失败
  // err的值包括(错误对象/描述错误的字符串)
  res.response_data = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };

  next();
});

// 注册解析 token 的全局中间件
const { expressjwt: jwt } = require("express-jwt");
const config = require("./config");
server.use(
  jwt({
    secret: config.jwtSecretKey,
    algorithms: ["HS256"],
  }).unless({ path: [/^\/api/] })
);

// 导入并注册用户路由中间件
const userRouter = require("./router/user");
server.use("/api", userRouter);
// 导入并注册用户信息路由中间件
const userinfoRouter = require("./router/userinfo")
server.use('/my',userinfoRouter)


// 定义并挂载错误级别的中间件
server.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.response_data(err);
  
  // 身份认证失败错误
  if(err.name === 'UnauthorizedError') return res.response_data('身份认证失败！')

  // 未知错误捕获
  res.response_data(err);
});

// 开始监听
server.listen(3000, function () {
  console.log("N-Mail Server listening at http://127.0.0.1:3000");
});
