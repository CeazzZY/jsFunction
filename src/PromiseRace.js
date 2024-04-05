Promise.prototype.myRace = function (promise) {
  new Promise((resolve, reject) => {
    const len = promise.length;

    for (let i = 0; i < len; i++) {
      Promise.resolve(promise[i])
        .then((res) => {
          resolve(res);
          return;
        })
        .catch((err) => {
          reject(err);
          return;
        });
    }
  });
};
