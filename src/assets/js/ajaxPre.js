/*
 * @Author: Xin 201220028@smail.nju.edu.cn
 * @Date: 2023-03-26 19:18:44
 * @LastEditors: Xin 201220028@smail.nju.edu.cn
 * @LastEditTime: 2023-03-29 16:02:27
 * @FilePath: \NMail\src\assets\js\ajaxPre.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 每次发起$.ajax或$.post或$.get请求之前，都会先调用$.ajaxPrefilter
// $.ajaxPrefilter的options 参数时 $.ajax或$.post或$.get的对象
$.ajaxPrefilter(function (options) {
  if (options.url.startsWith("/my")) {
    // 自动配置headers中的用于身份认证的Authorization
    options.headers = { Authorization: localStorage.getItem("token") || "" };

    options.complete = function (res) {
      if (
        res.responseJSON.status === 1 &&
        res.responseJSON.msg === "身份认证失败"
      ) {
        localStorage.removeItem("token");
        location.href = "/src/login.html";
      }
    };
  }

  options.url = "http://127.0.0.1:3007" + options.url;
});
