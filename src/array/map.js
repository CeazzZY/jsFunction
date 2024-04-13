Array.prototype._map = function (callback, context = window) {
  const newArr = [];
  const len = this.length;

  for (let i = 0; i < len; i++) {
    if (typeof callback == "function") {
      let res = callback.call(context, this[i], i, this);
      newArr.push(res);
    }
  }
  return newArr;
};
