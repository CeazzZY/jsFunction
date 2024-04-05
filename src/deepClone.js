function deepClone(value, hash = new WeakMap()) {
  if (value == null) return value;

  if (value instanceof RegExp) return new RegExp(value);

  if (value instanceof Date) return new Date(value);

  if (typeof value != "object") return value;
  let obj = new value.constructor(); // [] {}

  if (hash.get(value)) return hash.get(value);
  hash.set(value, obj);

  for (let key in value) {
    if (value.hasOwnProperty(key)) {
      obj[key] = deepClone(value[key], hash);
    }
  }
  return obj;
}
