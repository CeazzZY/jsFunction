Array.prototype._forEach = function (context = window, callback) {
  const len = this.length;

  for (let i = 0; i < len; i++) {
    typeof callback == "function" && callback.call(context, self[i], i, this);
  }
};
