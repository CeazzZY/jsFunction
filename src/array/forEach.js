Array.prototype._forEach = function (callback, context) {
  const len = this.length;

  for (let i = 0; i < len; i++) {
    typeof callback == "function" && callback.call(context, this[i], i);
  }
};

