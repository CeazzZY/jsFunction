Array.prototype._find = function (callback, context) {
  for (var i = 0; i < this.length; i++) {
    if (callback.call(context, this[i], i, this)) {
      return this[i];
    }
  }
};
