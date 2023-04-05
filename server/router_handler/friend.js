// 导入数据库连接和控制模块
const database = require("../database/index");

/**
 *
 * @api {POST} /my/friend/add 添加朋友
 * @apiName 添加朋友接口
 * @apiGroup 通讯录
 * @apiVersion  1.0.0
 *
 * @apiHeader {String} Authorization 包含用户信息的token
 *
 * @apiHeaderExample {json} Header-Example:
 * {
 *    "Authorization"  :  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiLms6Xlt7Tlt7QiLCJlbWFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU3ODAzNjY4MiwiZXhwIjoxNTc4MDcyNjgyfQ.Mwq7GqCxJPK-EA8LNrtMG04llKdZ33S9KBL3XeuBxuI
 * }
 *
 * @apiParam  {string} name 朋友名
 * @apiParam  {string} email 朋友邮箱
 * @apiParam  {string} phone_number(选填) 手机号
 * @apiParam  {string} home_address(选填) 家庭地址
 * @apiParam  {string} birthday(选填) 朋友生日
 * @apiParam  {string} qq(选填) 朋友QQ
 * @apiParam  {string} company(选填) 朋友公司
 * @apiParam  {string} apartment(选填) 朋友部门
 * @apiParam  {string} work(选填) 朋友职位
 * @apiParam  {string} comment(选填) 朋友的注释
 *
 * @apiSuccess (返回参数说明) {int} status 请求是否成功，0：成功；1：失败
 * @apiSuccess (返回参数说明) {string} message 请求结果的描述消息
 *
 * @apiParamExample  {json} Request-Example:
 * {
 *     "name"         : "徐杨鑫"
 *     "email"        : "poker-svg@foxmail.com"
 *     "phone_number" : "13113111311"
 *     "home_address" : "南京大学"
 *     "birthday"     : "2015-02-01"
 *     "qq"           : "2246796172"
 *     "company"      : "某公司"
 *     "apartment"    : "某部门"
 *     "work"         : "某职位"
 *     "comment"      : "我的注释"
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *     "status"  : 0,
 *     "message" : "添加朋友成功！"
 * }
 */
exports.addFriendHandler = (req, res) => {
  const data_to_be_added = {
    user_id: req.auth.id, // 用户id
    ...req.body,
  };

  // 插入新朋友
  const insert_friend_sqlStr = "insert into friends set ?";
  database.query(insert_friend_sqlStr, data_to_be_added, (err, results) => {
    if (err) {
      return res.response_data(err);
    }
    if (results.affectedRows !== 1) {
      return res.response_data("添加朋友失败,请稍后重试!");
    }

    return res.response_data("添加朋友成功!", 0);
  });
};

/**
 *
 * @api {GET} /my/friend/get/all 读取朋友列表
 * @apiName 读取朋友列表接口
 * @apiGroup 通讯录
 * @apiVersion  1.0.0
 *
 * @apiHeader {String} Authorization 包含用户信息的token
 *
 * @apiHeaderExample {json} Header-Example:
 * {
 *    "Authorization"  :  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiLms6Xlt7Tlt7QiLCJlbWFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU3ODAzNjY4MiwiZXhwIjoxNTc4MDcyNjgyfQ.Mwq7GqCxJPK-EA8LNrtMG04llKdZ33S9KBL3XeuBxuI
 * }
 *
 * @apiParam  {string} pagenum 页码值，URL参数(query)
 * @apiParam  {string} pagesize 每页显示邮件的数量，URL参数(query)
 *
 * @apiSuccess (返回参数说明) {int} status 请求是否成功，0：成功；1：失败
 * @apiSuccess (返回参数说明) {string} message 请求结果的描述消息
 * @apiSuccess (返回参数说明) {array} data 朋友信息数组，某一页的切片
 * @apiSuccess (返回参数说明) {int} data:id 朋友id
 * @apiSuccess (返回参数说明) {string} data:name 朋友姓名
 * @apiSuccess (返回参数说明) {string} data:email 朋友邮箱地址
 * @apiSuccess (返回参数说明) {string} data:company 朋友公司
 * @apiSuccess (返回参数说明) {string} data:apartment 朋友部门
 * @apiSuccess (返回参数说明) {string} data:work 朋友职位
 * @apiSuccess (返回参数说明) {string} data:phone_number 朋友电话号码
 * @apiSuccess (返回参数说明) {int} total 通讯录中朋友总数
 *
 * @apiParamExample  {json} Request-Example:
 * {
 *    "pagenum"  : 1
 *    "pagesize" : 2
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "status": 0,
 *    "message": "获取朋友列表成功！",
 *    "data": [
 *       {
 *          "id"            : 1,
 *          "name"          : "123",
 *          "email"         : "123@qq.com",
 *          "company"       : null,
 *          "apartment"     : null,
 *          "work"          : null,
 *          "phone_number"  : "13182968738"
 *       },
 *       {
 *          "id"            :2
 *          "name"          : "123",
 *          "email"         : "123@qq.com",
 *          "company"       : "某公司",
 *          "apartment"     : "某部门",
 *          "work"          : "某职位",
 *          "phone_number"  : "13182968738"
 *       }
 *    ],
 *    "total": 2
 * }
 */
exports.getAllFriendsHandler = (req, res) => {
  // 计算局部切片区域
  const list_info = req.query;
  const pagenum = parseInt(list_info.pagenum);
  const pagesize = parseInt(list_info.pagesize);
  const start = (pagenum - 1) * pagesize;
  const end = start + pagesize;

  // 根据用户id在朋友数据库中取出此用户的所有朋友信息，并按请求参数进行切片后返回
  const get_emails_sqlStr =
    "select id, name, email, company, apartment, work, phone_number from friends where user_id=?";

  database.query(get_emails_sqlStr, req.auth.id, (err, friends) => {
    if (err) return res.response_data(err);

    res.send({
      status: 0,
      message: "获取朋友列表成功！",
      data: friends.slice(start, end),
      total: friends.length,
    });
  });
};

/**
 *
 * @api {GET} /my/friend/get/id 获取朋友信息
 * @apiName 获取朋友信息接口
 * @apiGroup 通讯录
 * @apiVersion  1.0.0
 *
 * @apiHeader {String} Authorization 包含用户信息的token
 *
 * @apiHeaderExample {json} Header-Example:
 * {
 *    "Authorization"  :  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiLms6Xlt7Tlt7QiLCJlbWFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU3ODAzNjY4MiwiZXhwIjoxNTc4MDcyNjgyfQ.Mwq7GqCxJPK-EA8LNrtMG04llKdZ33S9KBL3XeuBxuI
 * }
 *
 * @apiParam  {int} friend_id 朋友id，URL参数(query)
 *
 * @apiSuccess (返回参数说明) {int} status 请求是否成功，0：成功，1：失败
 * @apiSuccess (返回参数说明) {string} message 请求结果的描述消息
 * @apiSuccess (返回参数说明) {object} data 朋友信息对象
 * @apiSuccess (返回参数说明) {int} data:id 朋友id
 * @apiSuccess (返回参数说明) {int} data:user_id 用户id
 * @apiSuccess (返回参数说明) {string} data:name 朋友姓名
 * @apiSuccess (返回参数说明) {string} data:email 朋友邮箱地址
 * @apiSuccess (返回参数说明) {string} data:phone_number 朋友电话号码
 * @apiSuccess (返回参数说明) {string} data:home_address 朋友家庭住址
 * @apiSuccess (返回参数说明) {string} data:birthday 朋友生日
 * @apiSuccess (返回参数说明) {string} data:qq 朋友QQ
 * @apiSuccess (返回参数说明) {string} data:company 朋友公司
 * @apiSuccess (返回参数说明) {string} data:apartment 朋友部门
 * @apiSuccess (返回参数说明) {string} data:work 朋友职位
 * @apiSuccess (返回参数说明) {string} data:comment 朋友备注
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "status": 0,
 *    "message": "获取朋友信息成功！",
 *    "data": {
 *        "id": 2,
 *        "user_id": "5",
 *        "name": "123",
 *        "email": "123@qq.com",
 *        "phone_number": "13182968738",
 *        "home_address": "南京大学",
 *        "birthday": "2023-04-05",
 *        "qq": "2686897775",
 *        "company": "某公司",
 *        "apartment": "某部门",
 *        "work": "某职位",
 *        "comment": "默认注释"
 *    }
 * }
 */
exports.getFriendByIdHandler = (req, res) => {
  // 根据用户id在朋友数据库中取出此用户的所有朋友信息，并按请求参数进行切片后返回
  const get_emails_sqlStr = "select * from friends where id=?";

  database.query(get_emails_sqlStr, req.query.friend_id, (err, results) => {
    if (err) return res.response_data(err);

    if (results.length != 1) return res.response_data("获取朋友信息失败！");

    if (parseInt(results[0].user_id) !== req.auth.id)
      return res.response_data("身份认证失败！");

    // 获取用户信息成功
    res.send({
      status: 0,
      message: "获取朋友信息成功！",
      data: results[0],
    });
  });
};
