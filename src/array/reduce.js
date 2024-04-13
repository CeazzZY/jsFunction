Array.prototype._reduce = function (callback, initialValue) {
  let res = initialValue ? initialValue : arr[0];
  const startIndex = initialValue ? 0 : 1;
  const len = this.length;

  for (let i = startIndex; i < len; i++) {
    res = callback.call(null, res, this[i], i, this);
  }
};
