function throttle(fn, delay) {
  let timer;

  return function (...argument) {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      fn.apply(this, argument);
      timer = null;
    }, delay);
  };
}
