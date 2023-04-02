// 导入数据库连接和操作模块
const database = require("../database/index");
// 导入用于发送邮件的第三方库
const nodemailer = require("nodemailer");

// 发送邮件的处理函数
/**
 *
 * @api {POST} /my/email/send 发送邮件
 * @apiName 发送邮件接口
 * @apiGroup 邮件
 * @apiVersion  1.0.0
 *
 * @apiHeader {String} Authorization 包含用户信息的token
 *
 * @apiHeaderExample {json} Header-Example:
 * {
 *    "Authorization"  :  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiLms6Xlt7Tlt7QiLCJlbWFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU3ODAzNjY4MiwiZXhwIjoxNTc4MDcyNjgyfQ.Mwq7GqCxJPK-EA8LNrtMG04llKdZ33S9KBL3XeuBxuI
 * }
 *
 * @apiParam  {string} receiver 收件方的邮箱地址
 * @apiParam  {string} title 邮件主题
 * @apiParam  {string} content 邮件内容
 *
 * @apiSuccess (返回参数说明) {int} status 请求是否成功，0：成功；1：失败
 * @apiSuccess (返回参数说明) {string} message 请求结果的描述消息
 *
 * @apiParamExample  {json} Request-Example:
 * {
 *    "receiver" : "201220028@smail.nju.edu.cn"
 *    "title"    : "poker-svg"
 *    "content"  : "<p>this is a test mail</p>"
 * }
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *    "status": 0,
 *    "message": "发送邮件成功！",
 * }
 */
exports.sendEmail = (req, res) => {
  // 获取客户端提交到服务器的邮件信息
  const email_info = req.body;

  const find_senderinfo_sqlStr = "select * from users where id=?";
  database.query(find_senderinfo_sqlStr, req.auth.id, (err, results) => {
    if (err) return res.response_data(err);
    if (results.length !== 1) return res.response_data("发送方不存在！");

    // 取出数据库中的用户名
    const sender_name = results[0].username;
    const sender_nickname = results[0].nickname;
    if (!sender_nickname) sender_nickname = sender_name;

    // 将邮件插入数据库中
    const insert_email_sqlStr = "insert into send_emails set ?";
    database.query(
      insert_email_sqlStr,
      {
        sender: sender_name,
        receiver: email_info.receiver,
        title: email_info.title,
        content: email_info.content,
      },
      (err, results) => {
        if (err) return res.response_data(err);
        if (results.affectedRows !== 1)
          return res.response_data("发送邮件失败,请稍后重试!");

        // 将邮件发送到目标邮箱
        let transporter = nodemailer.createTransport({
          service: "qq",
          port: 465,
          secureConnection: true,
          auth: {
            user: "2686897775@qq.com",
            pass: "rihaihthzarwdhcj",
          },
        });

        let mailOptions = {
          from: '"poker-svg" <poker-svg@foxmail.com>',
          to: email_info.receiver,
          subject:
            email_info.title +
            " from " +
            `${sender_nickname}<${sender_name}@smail.nju.edu.cn>`,
          html: email_info.content,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) return res.response_data("发送邮件失败,请稍后重试!");
          console.log("Message sent: %s", info.messageId);
        });

        return res.response_data("发送邮件成功！", 0);
      }
    );
  });
};

// 读取用户收件箱中的邮件
/**
 *
 * @api {GET} /my/email/read/received 读取收件箱
 * @apiName 读取收件箱接口
 * @apiGroup 邮件
 * @apiVersion  1.0.0
 *
 * @apiHeader {String} Authorization 包含用户信息的token
 *
 * @apiHeaderExample {json} Header-Example:
 * {
 *    "Authorization"  :  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIiwibmlja25hbWUiOiLms6Xlt7Tlt7QiLCJlbWFpbCI6Im5pYmFiYUBpdGNhc3QuY24iLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTU3ODAzNjY4MiwiZXhwIjoxNTc4MDcyNjgyfQ.Mwq7GqCxJPK-EA8LNrtMG04llKdZ33S9KBL3XeuBxuI
 * }
 *
 * @apiParam  {int} pagenum 页码值
 * @apiParam  {int} pagesize 每页显示邮件的数量
 *
 * @apiSuccess (返回参数说明) {int} status 请求是否成功，0：成功；1：失败
 * @apiSuccess (返回参数说明) {string} message 请求结果的描述消息
 * @apiSuccess (返回参数说明) {array} data 邮件数组，某一页的切片
 * @apiSuccess (返回参数说明) {int} data:id 邮件id
 * @apiSuccess (返回参数说明) {string} data:sender 发送方邮箱地址
 * @apiSuccess (返回参数说明) {string} data:receiver 接收方邮箱地址
 * @apiSuccess (返回参数说明) {string} data:title 邮件主题
 * @apiSuccess (返回参数说明) {string} data:content 邮件内容
 * @apiSuccess (返回参数说明) {string} data:is_delete 邮件是否被删除(必定未被删除) 0：未被删除；1：已被删除
 * @apiSuccess (返回参数说明) {string} data:is_readed 邮件是否被读取 0：未被读取；1：已被读取
 * @apiSuccess (返回参数说明) {string} data:time 邮件被接收时间 year/month/day hour:minute:second
 * @apiSuccess (返回参数说明) {int} total 收件箱中的邮件总数
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
 *    "message": "获取邮件列表成功",
 *    "data": [
 *      {
 *         "id": 1,
 *         "sender": "201220028@smail.nju.edu.cn",
 *         "receiver": "X-ray<123456@smail.nju.edu.cn>",
 *         "title": "test1",
 *         "content": "test1",
 *         "is_delete": 0,
 *         "is_readed": 0,
 *         "time": "2023/4/2 20:02:48"
 *      },
 *      {
 *         "id": 2,
 *         "sender": "201220028@smail.nju.edu.cn",
 *         "receiver": "X-ray<123456@smail.nju.edu.cn>",
 *         "title": "test2",
 *         "content": "test2",
 *         "is_delete": 0,
 *         "is_readed": 0,
 *         "time": "2023/4/2 20:02:49"
 *      }
 *    ],
 *    "total": 5
 * }
 */
exports.read_receiveMail = (req, res) => {
  // 计算局部切片区域
  const list_info = req.body;
  const pagenum = parseInt(list_info.pagenum);
  const pagesize = parseInt(list_info.pagesize);
  const start = (pagenum - 1) * pagesize;
  const end = start + pagesize;

  // 查询用户信息
  const find_senderinfo_sqlStr = "select * from users where id=?";
  database.query(find_senderinfo_sqlStr, req.auth.id, async (err, results) => {
    if (err) return res.response_data(err);
    if (results.length !== 1) return res.response_data("接收方不存在！");

    // 取出数据库中的用户名
    const userName = results[0].username;
    const userNickname = results[0].nickname;
    if (!userNickname) userNickname = userName;
    // 拼接成用户的email地址，eg: X-ray<123456@smail.nju.edu.cn>
    const receiver_name = `${userNickname}<${userName}@smail.nju.edu.cn>`;

    // 根据用户的email地址，在收件箱的数据库中取出此用户的所有邮件，并按请求参数进行切片后返回
    const get_emails_sqlStr = `select * from receive_emails where receiver=? and is_delete=0`;

    database.query(get_emails_sqlStr, receiver_name, (err, emails) => {
      if (err) return res.response_data(err);

      res.send({
        status: 0,
        message: "获取邮件列表成功",
        data: emails.slice(start, end),
        total: emails.length,
      });
    });
  });
};
