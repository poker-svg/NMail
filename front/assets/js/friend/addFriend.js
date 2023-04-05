/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-04-05 17:45:06
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-05 19:59:34
 * @FilePath: \NMail\front\assets\js\friend\addFriend.js
 * @Description: 添加朋友的前端操作
 */

$(function () {
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
