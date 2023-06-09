/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-04-05 17:44:58
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-06 12:14:16
 * @FilePath: \NMail\front\assets\js\friend\myFriends.js
 * @Description: 通讯录查看朋友列表前端JS操作
 */
$(function () {
  let default_query = {
    // 默认读取的页面参数
    pagenum: 1, // 页码数
    pagesize: 5, // 每页显示的朋友信息条数
  };

  initFriendsList();

  // 绑定表格点击事件，显示对应的朋友信息
  $("tbody").on("click", ".friend", function (e) {
    let friendId = $(this).attr("data-id");
    showFriendInfoById(friendId);

    $("#frined_info_container").attr(
      "class",
      "layui-collapse animate__animated animate__zoomIn"
    );
  });

  $("#frined_info_container").each(function () {
    $(this)[0].addEventListener("animationend", function () {
      $(this).attr("class", "layui-collapse");
    });
  });

  // 获取朋友列表数据
  function initFriendsList() {
    $.ajax({
      method: "GET",
      url: "/my/friend/get/all",
      data: default_query,
      success: function (res) {
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

        if (!first) {
          initFriendsList();
        }
      },
    });
  }

  // 展示朋友详细信息
  function showFriendInfoById(friendId) {
    $.ajax({
      method: "GET",
      url: "/my/friend/get/id",
      data: {
        friend_id: friendId,
      },
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg(res.msg);
        }

        // 展示朋友信息
        $("#frined_info_container #name").text(res.data.name);
        $("#frined_info_container #email").text(res.data.email);
        $("#frined_info_container #phone_number").text(res.data.phone_number);
        $("#frined_info_container #home_address").text(res.data.home_address);
        $("#frined_info_container #birthday").text(res.data.birthday);
        $("#frined_info_container #qq").text(res.data.qq);
        $("#frined_info_container #company-apartment-work").text(
          res.data.company + res.data.apartment + res.data.work
        );
        $("#frined_info_container #comment").text(res.data.comment);
      },
    });
  }
});
