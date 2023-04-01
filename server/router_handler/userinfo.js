/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-04-01 12:55:52
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-02 00:35:16
 * @FilePath: \NMail\server\router_handler\userinfo.js
 * @Description: 用户信息相关的处理函数
 */

// 导入数据库连接和操作模块
const database = require("../database/index");
// 导入用于数据加密的第三方库
const bcrypt = require("bcryptjs");

// 获取用户信息的处理函数
/**
 *
 * @api {GET} /my/userinfo 获取用户信息
 * @apiName 获取用户信息
 * @apiGroup 个人中心
 * @apiVersion  1.0.0
 *
 * @apiHeader {String} Authorization 包含用户信息的token
 *
 * @apiHeaderExample {json} Header-Example:
 * {
 *    "Authorization"  :  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiLms6Xlt7Tlt7QiLCJlbWFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU3ODAzNjY4MiwiZXhwIjoxNTc4MDcyNjgyfQ.Mwq7GqCxJPK-EA8LNrtMG04llKdZ33S9KBL3XeuBxuI
 * }
 *
 * @apiParam {Object} null 此接口没有参数
 *
 * @apiSuccess (返回参数说明) {int} status 请求是否成功，0：成功，1：失败
 * @apiSuccess (返回参数说明) {string} message 请求结果的描述消息
 * @apiSuccess (返回参数说明) {object} data 用户信息
 * @apiSuccess (返回参数说明) {int} data:id 用户id
 * @apiSuccess (返回参数说明) {string} data:username 用户名
 * @apiSuccess (返回参数说明) {string} data:nickname 用户昵称
 * @apiSuccess (返回参数说明) {string} data:email 用户邮箱
 * @apiSuccess (返回参数说明) {string} data:user_pic 用户头像(base64格式)
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "status": 0,
 *    "message": "获取用户信息成功！",
 *    "data": {
 *        "id": 3,
 *        "username": "user3",
 *        "nickname": "poker-svg",
 *        "email": "2686897775@qq.com",
 *        "user_pic": "data:image/png;base64,VEEFSDSEFDEFSGR="
 *    }
 * }
 */
exports.getUserInfo = (req, res) => {
  const get_userinfo_sqlStr =
    // 原来的sql语句，仅选出id, username, email, user_pic
    // "select id, username, email, user_pic from users where id=?";
    // 更新版本的sql语句，选出id, username, nickname, email, user_pic
    "select id, username, nickname, email, user_pic from users where id=?";
  database.query(get_userinfo_sqlStr, req.auth.id, (err, results) => {
    if (err) return res.response_data(err);
    if (results.length != 1) return res.response_data("获取用户信息失败");

    // 获取用户信息成功
    res.send({
      status: 0,
      message: "获取用户信息成功！",
      data: results[0],
    });
  });
};

// 更新用户信息的处理函数
/**
 *
 * @api {POST} /my/userinfo 更新用户信息
 * @apiName 更新用户信息接口
 * @apiGroup 个人中心
 * @apiVersion  1.0.0
 *
 * @apiHeader {String} Authorization 包含用户信息的token
 *
 * @apiHeaderExample {json} Header-Example:
 * {
 *    "Authorization"  :  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiLms6Xlt7Tlt7QiLCJlbWFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU3ODAzNjY4MiwiZXhwIjoxNTc4MDcyNjgyfQ.Mwq7GqCxJPK-EA8LNrtMG04llKdZ33S9KBL3XeuBxuI
 * }
 *
 * @apiParam  {number} id 用户id
 * @apiParam  {string} nickname 用户昵称
 * @apiParam  {string} email 用户邮箱
 *
 * @apiSuccess (返回参数说明) {int} status 请求是否成功，0：成功；1：失败
 * @apiSuccess (返回参数说明) {string} message 请求结果的描述消息
 *
 * @apiParamExample  {json} Request-Example:
 * {
 *    "id"       : 3
 *    "nickname" : "poker-svg"
 *    "email"    : "2686897775@qq.com"
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "status": 0,
 *    "message": "更新用户信息成功！",
 * }
 */
exports.updateUserInfo = (req, res) => {
  const update_userinfo_sqlStr = "update users set ? where id=?";

  // info: req.body.id(用户填写的表单中的id), req.auth(根据用户的token解析出来的id)
  // warning：为了前端不会通过id修改后台用户的id属性，这里将id设置为不可更改(一直保持为req.auth.id，而非req.body.id)
  // database.query(update_userinfo_sqlStr,[{...req.body, id: req.auth.id}, req.auth.id], (err, results) => {
  // warning：下面是原版api，允许前端根据id进行任意的更改(即可以修改自己的id)
  database.query(
    update_userinfo_sqlStr,
    [{ ...req.body, id: req.body.id }, req.body.id],
    (err, results) => {
      if (err) return res.response_data(err);
      if (results.affectedRows !== 1)
        return res.response_data("更新用户的基本信息失败！");

      // 更新用户信息成功
      res.response_data("更新用户信息成功！", 0);
    }
  );
};

// 更新用户密码的处理函数
/**
 *
 * @api {POST} /my/updatepwd 重置密码
 * @apiName 重置密码接口
 * @apiGroup 个人中心
 * @apiVersion  1.0.0
 *
 * @apiHeader {String} Authorization 包含用户信息的token
 *
 * @apiHeaderExample {json} Header-Example:
 * {
 *    "Authorization"  :  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiLms6Xlt7Tlt7QiLCJlbWFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU3ODAzNjY4MiwiZXhwIjoxNTc4MDcyNjgyfQ.Mwq7GqCxJPK-EA8LNrtMG04llKdZ33S9KBL3XeuBxuI
 * }
 *
 * @apiParam  {string} oldPwd 原密码
 * @apiParam  {string} newPwd 新密码
 *
 * @apiSuccess (返回参数说明) {int} status 请求是否成功，0：成功；1：失败
 * @apiSuccess (返回参数说明) {string} message 请求结果的描述消息
 *
 * @apiParamExample  {json} Request-Example:
 * {
 *    "oldPwd" : "123456"
 *    "newPwd" : "654321"
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "status": 0,
 *    "message": "更新密码成功！",
 * }
 */
exports.updatePwd = (req, res) => {
  const find_userinfo_sqlStr = "select * from users where id=?";
  database.query(find_userinfo_sqlStr, req.auth.id, (err, results) => {
    if (err) return res.response_data(err);
    if (results.length !== 1) return res.response_data("用户不存在！");

    // 验证用户提交密码并进行加密后更新至数据库
    const password_in_database = results[0].password;
    const compare_result = bcrypt.compareSync(
      req.body.oldPwd,
      password_in_database
    );
    if (!compare_result) return res.response_data("原密码错误！");

    const update_password_sqlStr = "update users set password=? where id=?";
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
    database.query(
      update_password_sqlStr,
      [newPwd, req.auth.id],
      (err, results) => {
        if (err) return res.response_data(err);
        if (results.affectedRows !== 1)
          return res.response_data("更新密码失败！");

        res.response_data("更新密码成功！");
      }
    );
  });
};

// 更新用户头像的处理函数
/**
 *
 * @api {POST} /my/user_pic 更换头像
 * @apiName 更换头像接口
 * @apiGroup 个人中心
 * @apiVersion  1.0.0
 *
 * @apiHeader {String} Authorization 包含用户信息的token
 *
 * @apiHeaderExample {json} Header-Example:
 * {
 *    "Authorization"  :  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiLms6Xlt7Tlt7QiLCJlbWFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU3ODAzNjY4MiwiZXhwIjoxNTc4MDcyNjgyfQ.Mwq7GqCxJPK-EA8LNrtMG04llKdZ33S9KBL3XeuBxuI
 * }
 *
 * @apiParam  {string} user_picture 新头像（base64格式的字符串）
 *
 * @apiSuccess (返回参数说明) {int} status 请求是否成功，0：成功；1：失败
 * @apiSuccess (返回参数说明) {string} message 请求结果的描述消息
 *
 * @apiParamExample  {json} Request-Example:
 * {
 *    "user_picture" : "data:image/png;base64,VEEFSDSEFDEFSGR="
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "status": 0,
 *    "message": "更新头像成功！",
 * }
 */
exports.updateUserPicture = (req, res) => {
  const update_user_picture_sqlStr = "update users set user_pic=? where id=?";
  database.query(
    update_user_picture_sqlStr,
    [req.body.user_picture, req.auth.id],
    (err, results) => {
      if (err) return res.response_data(err);
      if (results.affectedRows !== 1)
        return res.response_data("更换头像失败！");
    }
  );

  res.response_data("更换头像成功！", 0);
};
