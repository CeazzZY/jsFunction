const getData = () =>
  new Promise((resolve) => setTimeout(() => resolve("data"), 1000));

let res = getData().then((res) => {
  console.log(res);
});

setTimeout(() => {
  console.log(res);
}, 2000);
