// 导入定义验证规则的第三方库
const joi = require("joi");

// 定义朋友信息中的一系列的验证规则
const name = joi.string().required();
const email = joi.string().email().required();
const phone_number = joi
  .string()
  .min(11)
  .max(11)
  .pattern(
    /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  );
const home_address = joi.string();
// 生日日期格式为yyyy-MM-dd，需要补0
const birthday = joi
  .string()
  .pattern(
    /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/
  );
const qq = joi.string().pattern(/^[1-9]{1}[0-9]{4,14}$/);
const company = joi.string();
const apartment = joi.string();
const work = joi.string();
const comment = joi.string();

const pagenum = joi.required();
const pagesize = joi.required();

const friend_id = joi.number().required();

// 向外暴露添加朋友信息的验证规则
exports.add_friend_schema = {
  body: {
    name,
    email,
    phone_number,
    home_address,
    birthday,
    qq,
    company,
    apartment,
    work,
    comment,
  },
};

// 向外暴露获取朋友列表的验证规则
exports.get_all_friends_schema = {
  query: {
    pagenum,
    pagesize,
  },
};

// 向外暴露获取特定朋友信息的验证规则
exports.get_friend_by_id_schema = {
  query: {
    friend_id,
  },
};
