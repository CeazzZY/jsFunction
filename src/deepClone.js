function deepClone(value, hash = new WeakMap()) {
  if (value == null) return value;

  if (value instanceof RegExp) return new RegExp(value);

  if (value instanceof Date) return new Date(value);

  if (typeof value !== "object") return value;

  if (hash.get(obj)) return hash.get(obj);
  const value = obj.constructor();
  hash.set(obj.value);

  for (let key in value) {
    if (value.hasOwnProperty(key)) {
      ojb[key] = deepClone(value[key], hash);
    }
  }

  return ojb;
}
