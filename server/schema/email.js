// 导入定义验证规则的第三方库
const joi = require("joi");

// 定义收件人的邮箱地址验证规则
const receiver = joi.string().email().required();
const title = joi.string().required();
const content = joi.string().required();

// 向外暴露发送邮件时的验证规则
exports.send_email_schema = {
  body: {
    receiver,
    title,
    content,
  },
};
