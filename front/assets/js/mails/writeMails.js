/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-30 13:49:52
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-14 14:00:07
 * @FilePath: \NMail\front\assets\js\mails\writeMails.js
 * @Description: 用户写信的前端操作
 */
$(function () {
  // 初始化富文本编辑器
  initEditor();

  // 填充发件人
  addSenderInfo();

  let attachment_name = null;
  let attachment_data = null;
  let attachment_type = null;
  $("#attachmentInput").on("change", function (e) {
    if (this.files.length === 0) {
      console.log("请选择文件！");
      attachment_name = null;
      attachment_data = null;
      attachment_type = null;
      return;
    }

    const selectedFile = this.files[0];
    attachment_name = selectedFile.name;
    attachment_type = selectedFile.type;

    const reader = new FileReader();
    reader.onload = function () {
      attachment_data = this.result;
    };
    reader.readAsText(this.files[0]);
  });

  // 发送信件给后端
  $("#form-send_Email").on("submit", function (e) {
    e.preventDefault();

    let send_email_data =
      "receiver=" +
      $("#form-send_Email [name=receiver]").val() +
      "&" +
      "title=" +
      $("#form-send_Email [name=title]").val() +
      "&" +
      "content=" +
      $("#form-send_Email [name=content]").val();
    let attachment_email_data =
      "&" +
      "attachment_name=" +
      attachment_name +
      "&" +
      "attachment_data=" +
      attachment_data +
      "&" +
      "attachment_type=" +
      attachment_type;
    if (
      attachment_name != null &&
      attachment_data != null &&
      attachment_type != null
    ) {
      send_email_data += attachment_email_data;
    }
    $.ajax({
      url: "/my/email/send",
      type: "POST",
      data: send_email_data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.msg);
        }
        layer.msg("发送邮件成功！");
      },
    });
  });
});

function addSenderInfo() {
  $.ajax({
    url: "/my/userinfo",
    method: "GET",
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg(res.msg);
      }

      let userName = res.data.username;
      let nickName = res.data.nickname;
      if (!nickName) nickName = userName;
      $("#email_sender").html(
        `发件人： ${nickName}&lt${userName}@smail.nju.edu.cn&gt`
      );
    },
  });
}
