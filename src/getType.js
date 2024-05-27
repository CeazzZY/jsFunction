function getType(obj) {
  let type = typeof obj;
  if (type !== "object") {
    return type;
  }
  return Object.prototype.toString
    .call(obj)
    .replace(/^\[object (\S+)\]$/, "$1"); // 注意正则中间有个空格
}
