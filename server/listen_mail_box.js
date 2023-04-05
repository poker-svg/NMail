/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-04-03 22:19:20
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-04 18:18:08
 * @FilePath: \NMail\server\listen_mail_box.js
 * @Description: 监听邮箱模块，功能是监听代发邮箱，将收到的邮件分发给各个用户
 */

let Imap = require("imap");
let MailParser = require("mailparser").MailParser;
let mailDistributor = require("./distribute_mail");

let imap = new Imap({
  user: "2686897775@qq.com", //你的邮箱账号
  password: "poohxmdepcljddec", //你的邮箱密码
  host: "imap.qq.com", //邮箱服务器的主机地址
  port: 993, //邮箱服务器的端口地址
  tls: true, //使用安全传输协议
  tlsOptions: { rejectUnauthorized: false }, //禁用对证书有效性的检查
});

let email = {
  sender: null, //发件人
  title: null, //邮件主题
  receiver: null, //收件人
  content: null, //邮件内容
};

let return_data = {
  status: 0, //读取未读邮件失败
  message: "default", //消息提醒
  data: email, //返回的邮件消息
};

listenEmailBox();

function listenEmailBox() {
  imap.once("ready", function () {
    openInbox(function (err, box) {
      console.log("打开邮箱");
      if (err)
        return_data = {
          status: 0,
          message: err.message,
        };

      imap.search(
        // ["UNSEEN", ["SINCE", "May 20, 2022"]],
        ["UNSEEN", ["SINCE", "Apr 4, 2023"]],
        function (err, results) {
          if (err)
            return_data = {
              status: 0,
              message: err.message,
            };

          if (results.length === 0) {
            return_data = {
              status: 0,
              message: "目前没有未读邮件！",
            };
            imap.end();
            console.log(return_data.message);
            return;
          }

          imap.setFlags(results[0], ["\\Seen"], function (err) {
            if (!err) console.log("标记已读");
            else console.log(JSON.stringify(err, null, 2));
          });

          let f = imap.fetch(results[0], { bodies: "" });

          f.on("message", function (msg, seqno) {
            let mailparser = new MailParser();

            msg.on("body", function (stream, info) {
              stream.pipe(mailparser);

              //邮件头内容
              mailparser.on("headers", function (headers) {
                email.title = headers.get("subject");
                email.sender = headers.get("from").text;
                email.receiver = headers.get("to").text;
              });

              //邮件内容
              mailparser.on("data", function (data) {
                if (data.type === "text") {
                  email.content = data.text;
                }
              });
            });
            msg.once("end", function () {
              return_data = {
                status: 1,
                message: "抓取邮件成功！",
                data: email,
              };
            });
          });
          f.once("error", function (err) {
            console.log("抓取出现错误: " + err);
          });
          f.once("end", function () {
            console.log("所有邮件抓取完成!");
            imap.end();
          });
        }
      );
    });
  });

  imap.once("error", function (err) {
    console.log(err);
    return_data = {
      status: 0,
      message: err.message,
    };
  });

  imap.once("end", function () {
    console.log("关闭邮箱");
    return_data = {
      status: 1,
      message: "抓取邮件成功！",
      data: email,
    };

    console.log(return_data);

    // 分发邮件
    mailDistributor.distributeMail(email);
  });

  imap.connect();
}

function openInbox(cb) {
  imap.openBox("INBOX", true, cb);
}
