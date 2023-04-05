/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-26 19:18:44
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-05 21:50:30
 * @FilePath: \NMail\assets\js\login.js
 * @Description: 登录注册的前端操作
 */
$(function () {
  // 登录界面切换为注册界面
  $("#link_register_page").on("click", function () {
    $(".login_page").hide();
    $(".register_page").show();
  });

  // 注册界面切换为登录界面
  $("#link_login_page").on("click", function () {
    $(".register_page").hide();
    $(".login_page").show();
  });

  var form = layui.form;
  var layer = layui.layer;

  // 表单前端验证（密码限制、确认密码限制）
  form.verify({
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],

    repass: function (newpwd) {
      var oldpwd = $(".register_page [name=regitser_user_password]").val();

      if (newpwd != oldpwd) {
        return "两次密码不一致";
      }
    },
  });

  // 前端发送注册请求给后端服务器
  $("#form-reg").on("submit", function (e) {
    // 阻止默认提交行为
    e.preventDefault();

    const register_data =
      "username=" +
      $("#form-reg [name=register_username]").val() +
      "&" +
      "password=" +
      $("#form-reg [name=regitser_user_password]").val();

    $.ajax({
      url: "/api/reguser",
      type: "POST",
      data: register_data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.msg);
        }
        layer.msg("注册成功");
        $("#link_login_page").trigger("click");
      },
    });
  });

  // 前端发送登录请求给后端服务器
  $("#form-login").on("submit", function (e) {
    // 阻止默认提交行为
    e.preventDefault();

    const login_data =
      "username=" +
      $("#form-login [name=login_username]").val() +
      "&" +
      "password=" +
      $("#form-login [name=login_user_password]").val();

    $.ajax({
      url: "/api/login",
      type: "POST",
      data: login_data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.msg);
        }
        layer.msg("登录成功");
        // 将服务器发回的token存储在localStorage中
        localStorage.setItem("token", res.token);
        // 跳转到N-Mail主页
        location.href = "./index.html";
      },
    });
  });
});
