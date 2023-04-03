/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-30 13:49:37
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-03 09:17:59
 * @FilePath: \NMail\front\assets\js\mails\readMails.js
 * @Description: 前端读取收件箱操作
 */
$(function () {
  let default_query = {
    // 默认读取的页面参数
    pagenum: 1, // 页码数
    pagesize: 5, // 每页显示的信件条数
  };

  initReceiveMailsList();

  // 获取邮件列表数据
  function initReceiveMailsList() {
    $.ajax({
      method: "GET",
      url: "/my/email/read/received",
      data: default_query,
      success: function (res) {
        console.log(res);

        if (res.status !== 0) {
          return layui.layer.msg(res.msg);
        }
        // 使用模板引擎渲染页面数据
        let htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);

        // renderPage(res.total);
      },
    });
  }
});
