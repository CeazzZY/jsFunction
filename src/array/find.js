Array.prototype._find = function (callback) {
  for (var i = 0; i < this.length; i++) {
    if (callback(this[i], i)) {
      return this[i];
    }
  }
};
