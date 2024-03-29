function debounce(fn, delay) {
  let timer;

  return function (...argument) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn.apply(this, argument);
    }, delay);
  };
}
