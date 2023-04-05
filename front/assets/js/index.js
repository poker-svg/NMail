/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-26 19:18:44
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-05 20:46:58
 * @FilePath: \NMail\src\assets\js\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
$(function () {
  getUserInfo();

  $("#btnLogout").on("click", function () {
    layui.layer.confirm(
      "确定要退出吗？",
      {
        icon: 3,
        title: "提示",
        btn: ["确定", "取消"],
      },
      function (index) {
        localStorage.removeItem("token");
        location.href = "/front/login.html";
        layui.layer.close(index);
      }
    );
  });
});

function getUserInfo() {
  $(".layui-nav-img").hide();
  $.ajax({
    url: "/my/userinfo",
    method: "GET",
    success: function (res) {
      if (res.status !== 0) {
        layui.layer.msg(res.msg);
        location.href = "/front/login.html";
        return;
      }
      renderAvatar(res.data);
    },
  });
}

function renderAvatar(user) {
  // 欢迎用户
  let name = user.nickname || user.username;
  let now = new Date();
  let hour = now.getHours();
  let hello = "早上好";
  if (hour < 6) {
    hello = "凌晨好";
  } else if (hour < 9) {
    hello = "早上好";
  } else if (hour < 12) {
    hello = "上午好";
  } else if (hour < 14) {
    hello = "中午好";
  } else if (hour < 17) {
    hello = "下午好";
  } else if (hour < 19) {
    hello = "傍晚好";
  } else if (hour < 22) {
    hello = "晚上好";
  } else {
    hello = "夜里好";
  }

  $("#welcome").html(`${hello} ${name}`);

  // 用户头像渲染
  if (user.user_pic !== null) {
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    let first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
    $(".layui-nav-img").hide();
  }
}

function setNavSelected(origin, current) {
  $(origin).addClass("layui-this");
  $(current).removeClass("layui-this");
}
