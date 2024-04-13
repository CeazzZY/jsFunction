Array.prototype._filter = function (callback, context) {
  const newArr = [];
  const len = this.length;

  for (let i = 0; i < len; i++) {
    if (callback.call(context, this[i], i, this)) {
      newArr.push(this[i]);
    }
  }
  return newArr;
};
