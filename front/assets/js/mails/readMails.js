/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-30 13:49:37
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-03 10:35:53
 * @FilePath: \NMail\front\assets\js\mails\readMails.js
 * @Description: 前端读取收件箱操作
 */
$(function () {
  let default_query = {
    // 默认读取的页面参数
    pagenum: 1, // 页码数
    pagesize: 2, // 每页显示的信件条数
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

        renderPage(res.total);
      },
    });
  }

  // 渲染分页
  function renderPage(total) {
    layui.laypage.render({
      elem: "pageBox",
      count: total,
      limit: default_query.pagesize,
      curr: default_query.pagenum,
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        default_query.pagenum = obj.curr;
        default_query.pagesize = obj.limit;

        /* 注意: jump回调有两种触发方式
                1、当点击分页的页码时
                2、当layui.laypage.render方法被调用时
                如果是2方式触发，则可能出现死循环，initArticleList -> renderPage -> jump -> initArticleLis
                所以需要判断jump是否是2触发的，排除该种方式触发产生的initArticleList调用
                layui的jump回调函数的第二个参数first就是来提示jump的触发方式，如果first为true，则为2触发，否则为1触发
            */
        if (!first) {
          initReceiveMailsList();
        }
      },
    });
  }
});
