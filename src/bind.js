Function.prototype._bind = function (context = window, ...arg) {
  let self = this;

  let bindFn = function (...innerArg) {
    return self.apply(
      this instanceof context ? this : context,
      arg.concat(innerArg)
    );
  };
  fBound.prototype = Object.create(this.prototype);
  return bindFn;
};
