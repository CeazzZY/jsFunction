function sum(...a) {
  function inner(...b) {
    a.push(...b);
    return inner;
  }

  inner.valueOf = () => a.reduce((c, d) => c + d, 0);
  return inner;
}
