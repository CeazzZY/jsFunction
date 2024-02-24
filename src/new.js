function _new(constructor, ...args) {
  let newObj = Object.create(constructor.prototype);
  let res = constructor.apply(newObj, args);

  return typeof res === "object" ? res : newObj;
}
