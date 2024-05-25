let arr = [1, [2, 3, [4, [5]]]];

//1
function flatten1(arr) {
  var res = [];
  for (let i = 0, length = arr.length; i < length; i++) {
    if (Array.isArray(arr[i])) {
      res.push(...flatten(arr[i])); //concat 并不会改变原数组
    } else {
      res.push(arr[i]);
    }
  }
  return res;
}

//2
function flatten2(arr) {
  return arr.reduce((res, next) => {
    return res.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}

//3
function flatten3(arr) {
  if (!arr.length) return;
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

console.log(flatten3(arr))
