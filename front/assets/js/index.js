/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-26 19:18:44
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-03-29 17:00:12
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
      //   console.log(res);
      if (res.status !== 0) {
        return layui.layer.msg(res.msg);
      }
      renderAvatar(res.data);
    },
  });
}

function renderAvatar(user) {
  // 欢迎用户
  var name = user.nickname || user.username;
  $("#welcome").html(`欢迎 ${name}`);

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
