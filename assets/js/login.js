/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-26 19:18:44
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-03-27 17:25:57
 * @FilePath: \NMail\assets\js\login.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
$(function () {
  $("#link_register_page").on("click", function () {
    $(".login_page").hide();
    $(".register_page").show();
  });

  $("#link_login_page").on("click", function () {
    $(".register_page").hide();
    $(".login_page").show();
  });

  var form = layui.form;
  var layer = layui.layer;

  form.verify({
    pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],

    repass: function (newpwd) {
      var oldpwd = $(".register_page [name=regitser_user_password]").val();

      if (newpwd != oldpwd) {
        return "两次密码不一致";
      }
    },
  });

  $("#form-reg").on("submit", function (e) {
    e.preventDefault();

    $.ajax({
      url: "/api/reguser",
      type: "POST",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.msg);
        }
        layer.msg("注册成功");
        $("#link_reg").trigger("click");
      },
    });
  });

  $("#form-login").on("submit", function (e) {
    e.preventDefault();

    $.ajax({
      url: "/api/login",
      type: "POST",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.msg);
        }
        layer.msg("登录成功");
        localStorage.setItem("token", res.token);
        location.href = "./index.html";
      },
    });
  });
});
