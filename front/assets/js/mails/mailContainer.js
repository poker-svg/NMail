$(function () {
  let email_id = getUrlParam("id");
  // 初始化富文本编辑器
  initEditor();

  if (email_id) {
    $.ajax({
      method: "GET",
      url: `/my/email/read/received/${email_id}`,
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg(res.msg);
        }

        $("#email_title").html(`${res.data.title}`);
        $("#sender").html(`发件人：${res.data.sender}`);
        $("#time").html(`时 间：${res.data.time}`);
        $("#receiver").html(`收件人：${res.data.receiver}`);
        $("#content").html(`${res.data.content}`);
      },
    });
  }

  //获取url中的参数
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
  }
});
