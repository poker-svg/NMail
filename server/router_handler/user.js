/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-31 09:49:26
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-02 00:34:56
 * @FilePath: \NMail\server\router_handler\user.js
 * @Description: 后端的用户处理器
 */

// 导入数据库连接和控制模块
const database = require("../database/index");
// 导入用于加密的第三方包
const bcrypt = require("bcryptjs");
// 导入用于token生成的包
const json_web_token = require("jsonwebtoken");
// 导入全局配置模块
const config = require("../config");

// 注册新用户的处理函数
/**
 *
 * @api {POST} /api/reguser 注册用户
 * @apiName 用户注册接口
 * @apiGroup 登录注册
 * @apiVersion  1.0.0
 *
 * @apiParam  {string} username 用户名
 * @apiParam  {string} password 密码
 *
 * @apiSuccess (返回参数说明) {int} status 请求是否成功，0：成功；1：失败
 * @apiSuccess (返回参数说明) {string} message 请求结果的描述消息
 *
 * @apiParamExample  {json} Request-Example:
 * {
 *     "username" : "user"
 *     "password" : "password"
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *     "status"  : 0,
 *     "message" : "注册成功！"
 * }
 */
exports.regUserHandler = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body;

  // 检查用户名是否被占用
  const sqlStr = "select * from users where username=?";
  database.query(sqlStr, userinfo.username, (err, results) => {
    if (err) {
      return res.response_data(err);
    }
    if (results.length > 0) {
      return res.response_data("用户名被占用，请更换其他用户名！");
    }

    // 对密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);
    // 插入新用户
    const insert_sqlStr = "insert into users set ?";
    database.query(
      insert_sqlStr,
      { username: userinfo.username, password: userinfo.password },
      (err, results) => {
        if (err) {
          return res.response_data(err);
        }
        if (results.affectedRows !== 1) {
          return res.response_data("注册用户失败,请稍后重试!");
        }

        return res.response_data("注册用户成功!", 0);
      }
    );
  });
};

// 用户登录的处理函数
/**
 *
 * @api {POST} /api/login 用户登录
 * @apiName 用户登录接口
 * @apiGroup 登录注册
 * @apiVersion  1.0.0
 *
 * @apiParam  {string} username 用户名
 * @apiParam  {string} password 密码
 *
 * @apiSuccess (返回参数说明) {int} status 请求是否成功，0：成功；1：失败
 * @apiSuccess (返回参数说明) {string} message 请求结果的描述消息
 * @apiSuccess (返回参数说明) {string} token 用于有权限接口的身份认证
 *
 * @apiParamExample  {json} Request-Example:
 * {
 *     "username" : "user"
 *     "password" : "password"
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "status": 0,
 *    "message": "登录成功！",
 *    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiLms6Xlt7Tlt7QiLCJlbWFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU3ODAzNjY4MiwiZXhwIjoxNTc4MDcyNjgyfQ.Mwq7GqCxJPK-EA8LNrtMG04llKdZ33S9KBL3XeuBxuI"
 * }
 */
exports.loginHandler = (req, res) => {
  const userinfo = req.body;

  // 在数据库中查询登录用户信息
  const select_user_sqlStr = "select * from users where username=?";
  database.query(select_user_sqlStr, userinfo.username, (err, results) => {
    if (err) {
      return res.response_data(err);
    }
    if (results.length !== 1) {
      return res.response_data("登陆失败！");
    }

    // 判断用户密码是否正确
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    );
    if (!compareResult) return res.response_data("登陆失败！");

    // 生成客户端的token并发回客户端，为了安全token应剔除用户敏感信息
    const user = { ...results[0], password: "", user_pic: "" };
    const tokenStr = json_web_token.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn,
    });
    res.send({
      status: 0,
      message: "登录成功！",
      token: "Bearer " + tokenStr,
    });
  });
};
