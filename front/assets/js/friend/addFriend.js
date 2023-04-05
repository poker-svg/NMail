/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-04-05 17:45:06
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-05 22:16:13
 * @FilePath: \NMail\front\assets\js\friend\addFriend.js
 * @Description: 添加朋友的前端操作
 */

$(function () {
  // 表单前端验证
  layui.form.verify({
    birthday: [
      /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/,
      "请输入正确的日期",
    ],

    qq: [/^[1-9]{1}[0-9]{4,14}$/, "请输入正确的QQ号"],
  });

  // 前端发送添加新用户请求给后端服务器
  $("#add_friend_form").on("submit", function (e) {
    // 阻止默认提交行为
    e.preventDefault();
    console.log("tag1");
    const friend_data = {
      name: $("#name").val(),
      email: $("#email").val(),
      phone_number: $("#phone_number").val(),
      home_address: $("#home_address").val(),
      birthday: $("#birthday").val(),
      qq: $("#qq").val(),
      company: $("#company").val(),
      apartment: $("#apartment").val(),
      work: $("#work").val(),
      comment: $("#comment").val(),
    };

    $.ajax({
      url: "/my/friend/add",
      type: "POST",
      data: friend_data,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.msg);
        }
        layer.msg("添加新朋友成功");
      },
    });
  });
});
