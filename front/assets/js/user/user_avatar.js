/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-26 19:18:44
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-04-02 13:03:42
 * @FilePath: \NMail\front\assets\js\user\user_avatar.js
 * @Description: 前端向后端提交更改头像的请求
 */
$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $("#image");
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  $("#btnChooseImage").on("click", function () {
    $("#file").trigger("click");
  });

  $("#file").on("change", function (e) {
    var fileList = e.target.files;
    if (fileList.length === 0) {
      return layui.layer.msg("请选择图片");
    }

    var file = e.target.files[0];
    var imgURL = URL.createObjectURL(file);
    $image.cropper("destroy").attr("src", imgURL).cropper(options);
  });

  $("#btnUpload").on("click", function (e) {
    var dataURL = $image
      .cropper("getCroppedCanvas", {
        width: 100,
        heigeht: 100,
      })
      .toDataURL("image/png");

    $.ajax({
      method: "POST",
      url: "/my/update/user_pic",
      data: {
        user_picture: dataURL,
      },
      success: function (res) {
        layui.layer.msg(res.msg);

        if (res.status !== 0) return;

        window.parent.getUserInfo();
      },
    });
  });
});
