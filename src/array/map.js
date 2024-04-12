Array.prototype._map = function (callback, context = window) {
  const arr = [...this];
  const newArr = [];
  const len = this.length;

  for (let i = 0; i < len; i++) {
    if (typeof callback == "function") {
      let res = callback.call(context, arr[i], i, arr);
      newArr.push(res);
    }
  }
  return newArr;
};
