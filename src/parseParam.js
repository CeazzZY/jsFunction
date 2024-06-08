function parseParam(url) {
  const [, param] = url.split("?");
  const result = {};
  param &&
    param.split("&").forEach((item) => {
      if (item.indexOf("=") > -1) {
        let [key, value] = item.split("=");
        value = decodeURIComponent(value);

        if (result.hasOwnProperty(key)) {
          result[key] = [].concat(result[key], value);
        } else {
          result[key] = value;
        }
      } else {
        result[item] = true;
      }
    });

  return result;
}
