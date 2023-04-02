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
  // 获取客户端提交到服务器的用户信息
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
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
        });

        return res.response_data("发送邮件成功！", 0);
      }
    );
  });
};
