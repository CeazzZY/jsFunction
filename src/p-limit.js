function limit(limit, request) {
  const signal = limit;
  const task = [];

  async function run() {
    if (task.length > 0 && signal > 0) {
      const task = task.shift();
      if (task) {
        signal--;
        await task();
        signal++;
        run();
      }
    }
  }

  return async (...arg) => {
    return new Promise((resolve, reject) => {
      task.push(async () => {
        try {
          const result = await request(...arg);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      run();
    });
  };
}
