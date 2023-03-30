/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-26 19:18:44
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-03-30 12:48:10
 * @FilePath: \NMail\front\assets\js\user\user_info.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
$(function () {
  layui.form.verify({
    nickname: [/^[\S]{1,6}$/, "用户昵称只能是1~6个字符，且不能包含空格"],
  });

  // 初始化用户信息并显示
  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg(res.msg);
        }
        /* $('.layui-form [name=username]').attr('value', res.data.username)
                $('.layui-form [name=nickname]').attr('value', res.data.nickname)
                $('.layui-form [name=email]').attr('value', res.data.email) */

        layui.form.val("formUserInfo", res.data);
      },
    });
  }

  initUserInfo();

  $("#btnReset").on("click", function (e) {
    e.preventDefault();
    initUserInfo();
  });

  // 修改用户信息
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();

    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        layui.layer.msg(res.msg);

        if (res.status !== 0) return;

        window.parent.getUserInfo();
      },
    });
  });
});
