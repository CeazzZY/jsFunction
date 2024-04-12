function asyncToGenerator(generatorFunc) {
  // 传入一个迭代器函数
  return function () {
    //返回一个“async”函数
    const gen = generatorFunc.apply(this, arguments); // 执行迭代器函数，获得迭代器对象
    return new Promise((resolve, reject) => {
      // “async”函数需返回Promise
      function step(key, arg) {
        // 自动执行器函数
        let generatorResult;
        try {
          generatorResult = gen[key](arg); // 根据传入的参数执行next或throw
        } catch (error) {
          return reject(error); // 和上面一样的错误处理
        }
        const { value, done } = generatorResult; // 从执行结果中结构出迭代器的当前状态
        if (done) {
          return resolve(value); // 如果迭代器执行结束，resolve这个Proimse，流程结束
        } else {
          // step函数再返回一个Promise，当value的状态改变时，传入then的函数自动执行
          return value.then(
            function onResolve(val) {
              step("next", val); // 再次进入step函数，递归
            },
            function onReject(err) {
              step("throw", err);
            }
          );
        }
      }
      step("next"); // 执行第一步step，后面会自动执行
    });
  };
}

const getData = () =>
  new Promise((resolve) => setTimeout(() => resolve("data"), 1000));

const test = asyncToGenerator(function* testG() {
  const data = yield getData();
  console.log("第一次获取数据: ", data);
  const data2 = yield getData();
  console.log("第二次获取数据: ", data2);
  return "success";
});

test();
