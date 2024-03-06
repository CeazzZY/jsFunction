Function.prototype._apply = function (context = window, arg) {
  if (typeof context !== "object") context = new Object(context);

  const fnKey = Symbol();

  context[fnKey] = this;

  const result = context[fnKey](...arg);
  delete context[fnKey];
  return result;
};
