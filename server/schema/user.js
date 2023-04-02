/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-31 15:05:34
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-01 23:35:51
 * @FilePath: \NMail\server\schema\user.js
 * @Description: 用户数据验证模块，包括用户登录、注册、信息修改接口所需的数据验证
 */

// 导入定义验证规则的第三方库
const joi = require("joi");

// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required();
const password = joi
  .string()
  .pattern(/^[\S]{6,12}$/)
  .required();

// 定义用户信息中id, nickname, email 的验证规则
const id = joi.number().integer().min(1).required();
const nickname = joi.string().required();
const email = joi.string().email().required();

// 定义用户头像的验证规则
const user_picture = joi.string().dataUri().required();

// 向外暴露用户数据的验证规则
exports.reg_login_schema = {
  body: {
    username,
    password,
  },
};

// 向外暴露更新用户数据时的验证规则
exports.update_userinfo_schema = {
  body: {
    id,
    nickname,
    email,
  },
};

// 向外暴露更新用户密码的验证规则
exports.update_password_schema = {
  body: {
    oldPwd: password,
    newPwd: joi.not(joi.ref("oldPwd")).concat(password),
  },
};

exports.update_user_picture_schema = {
  body: {
    user_picture,
  },
};
