function jsonp({ url, params, callback }) {
  return new Promise((resolve, reject) => {
    let script = document.createElement("script");

    window[callback] = function (data) {
      resolve(data);
      document.body.removeChild(script);
    };
    var arr = [];
    for (var key in params) {
      arr.push(`${key}=${params[key]}`);
    }

    script.src = `${url}?callback=${callback}&${arr.join("&")}`;
    document.body.appendChild(script);
  });
}
