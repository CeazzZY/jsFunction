function debounce(fn, delay) {
  let timer;

  return (...argument) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn.apply(this,argument);
    }, delay);
  };
}