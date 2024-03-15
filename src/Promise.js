/**
 * Promises/A+规范 实现一个promise
 * https://promisesaplus.com/
*/

const EMUM = {
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED'
  }
  
  // x 返回值
  // promise2 then的时候new的promise
  // promise2的resolve, reject
  const resolvePromise = (x, promise2, resolve, reject)=>{
    // 解析promise的值解析promise2是成功还是失败 传递到下层then
    if(x === promise2) {
      reject(new TypeError('类型错误'))
    }
    // 这里的x如果是一个promise的话 可能是其他的promise，可能调用了成功 又调用了失败
    // 防止resolve的时候 又throw err抛出异常到reject了
    let called
    // 如果x是promise 那么就采用他的状态
    // 有then方法是promise
    if(typeof x === 'object' && typeof x!== null || typeof x === 'function') {
      // x是对象或函数
      try {
        let then = x.then // 缓存，不用多次取值
        if(typeof then === 'function') {
          // 是promise，调用then方法里面有this，需要传入this为x才能取到then方法里面的值this.value
          then.call(x, y=>{// 成功
            // y值可能也是一个promise 如resolve(new Promise()) 此时的y==new Promise()
            // 递归解析y，直到拿到普通的值resolve(x出去)
            if(called) return;
            called = true;
  
            resolvePromise(y, promise2, resolve, reject)
          },r=>{// 一旦失败直接失败
            if(called) return;
            called = true;
            reject(r)
          })
        } else {
          // 普通对象不是promise
          resolve(x)
        }
      } catch (e) {
        // 对象取值可能报错，用defineProperty定义get 抛出异常
        if(called) return;
        called = true;
        reject(e)
      }
    } else {
      // x是普通值
      resolve(x) // 直接成功
    }
    
  }
  class myPromise {
    constructor(executor) {
      this.status = EMUM.PENDING // 当前状态
      this.value = undefined // resolve接收值
      this.reason = undefined // reject失败返回值
  
      /**
       * 同一个promise可以then多次(发布订阅模式)
       * 调用then时 当前状态是等待态，需要将当前成功或失败的回调存放起来（订阅）
       * 调用resolve时 将订阅函数进行执行（发布）
      */
      // 成功队列
      this.onResolvedCallbacks = []
      // 失败队列
      this.onRejectedCallbacks = []
      const resolve = value =>{
        // 如果value是一个promise，需要递归解析
        // 如 myPromise.resolve(new myPromise()) 需要解析value
        if(value instanceof myPromise) {
          // 不停的解析 直到值不是promise
          return value.then(resolve,reject)
        }
  
        if(this.status === EMUM.PENDING) {
          this.status = EMUM.FULFILLED
          this.value = value
  
          this.onResolvedCallbacks.forEach(fn=>fn())
        }
      }
      const reject = reason =>{
        if(this.status === EMUM.PENDING) {
          this.status = EMUM.REJECTED
          this.reason = reason
  
          this.onRejectedCallbacks.forEach(fn=>fn())
        }
      }
      try {
        executor(resolve,reject)
      } catch(e) {
        reject(e)
      }
    }
    then(onFulFilled, onRejected) {
      // 透传 处理默认不传的情况
      // new Promise((resolve,reject)=>{
      //   resolve(1)
      // }).then().then().then(d=>{})
      // new Promise((resolve,reject)=>{
      //   resolve(1)
      // }).then(v=>v).then(v=>v).then(d=>{})
      // new Promise((resolve,reject)=>{
      //   reject(1)
      // }).then().then().then(null, e=>{console.log(e)})
      // new Promise((resolve,reject)=>{
      //   reject(1)
      // }).then(null,e=>{throw e}).then(null,e=>{throw e}).then(null,e=>{console.log(e)})
      onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : v => v
      onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}
  
      // 调用then 创建一个新的promise
      let promise2 = new myPromise((resolve,reject)=>{
        // 根据value判断是resolve 还是reject value也可能是promise
        if(this.status === EMUM.FULFILLED) {
          setTimeout(() => {
            try {
              // 成功回调结果
              let x = onFulFilled(this.value)
              // 解析promise
              resolvePromise(x, promise2,resolve,reject)
            } catch (error) {
              reject(error)
            }
          }, 0);
        }
        if(this.status === EMUM.REJECTED) {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              // 解析promise
              resolvePromise(x, promise2,resolve,reject)
            } catch (error) {
              reject(error)
            }
          }, 0);
        }
        // 用户还未调用resolve或reject方法
        if(this.status === EMUM.PENDING) {
          this.onResolvedCallbacks.push(()=>{
            try {
              let x = onFulFilled(this.value)
              // 解析promise
              resolvePromise(x, promise2,resolve,reject)
            } catch (error) {
              reject(error)
            }
          })
          this.onRejectedCallbacks.push(()=>{
            try {
              let x = onRejected(this.reason)
              // 解析promise
              resolvePromise(x, promise2,resolve,reject)
            } catch (error) {
              reject(error)
            }
          })
        }
      })
      
      return promise2
    }
    catch(errCallback) {
      // 等同于没有成功，把失败放进去而已
      return this.then(null, errCallback)
    }
    // myPromise.resolve 具备等待功能的 如果参数的promise会等待promise解析完毕在向下执行
    static resolve(val) {
      return new myPromise((resolve,reject)=>{
        resolve(val)
      })
    }
    // myPromise.reject 直接将值返回
    static reject(reason) {
      return new myPromise((resolve,reject)=>{
        reject(reason)
      })
    }
    // finally传入的函数 无论成功或失败都执行
    // Promise.reject(100).finally(()=>{console.log(1)}).then(d=>console.log('success',d)).catch(er=>console.log('faild',er))
    // Promise.reject(100).finally(()=>new Promise()).then(d=>console.log(d)).catch(er=>)
    finally(callback) {
      return this.then((val)=>{
        return myPromise.resolve(callback()).then(()=>val)
      },(err)=>{
        return myPromise.resolve(callback()).then(()=>{throw err})
      })
    }
    // Promise.all
    static all(values) {
      return new myPromise((resolve,reject)=>{
        let resultArr = []
        let orderIndex = 0
        const processResultByKey = (value,index)=>{
          resultArr[index] = value 
          // 处理完全部
          if(++orderIndex === values.length) {
            resolve(resultArr) // 处理完成的结果返回去
          }
        }
        for (let i = 0; i < values.length; i++) {
          const value = values[i];
          // 是promise
          if(value && typeof value.then === 'function') {
            value.then((val)=>{
              processResultByKey(val,i)
            },reject)
          } else {
            // 不是promise情况
            processResultByKey(value,i)
          }
        }
      })
    }
    static race(promises) {
      // 采用最新成功或失败的作为结果
      return new myPromise((resolve,reject)=>{
        for (let i = 0; i < promises.length; i++) {
          let val = promises[i]
          if(val && typeof val.then === 'function') {
            // 任何一个promise先调用resolve或reject就返回结果了 也就是返回执行最快的那个promise的结果
            val.then(resolve,reject)
          }else{
            // 普通值
            resolve(val)
          }
        }
      })
    }
  }
  
  
  /**
   * =====测试用例-====
   */
  // let promise1 = new myPromise((resolve,reject)=>{
  //   setTimeout(() => {
  //     resolve('成功')
  //   }, 900);
  // })
  
  // promise1.then(val=>{
  //   console.log('success', val)
  // },reason=>{
  //   console.log('fail', reason)
  // })
  
  /**
   * then的使用方式 普通值意味不是promise
   * 
   * 1、then中的回调有两个方法 成功或失败 他们的结果返回（普通值）会传递给外层的下一个then中
   * 2、可以在成功或失败中抛出异常，走到下一次then的失败中
   * 3、返回的是一个promsie，那么会用这个promise的状态作为结果，会用promise的结果向下传递
   * 4、错误处理，会默认先找离自己最新的错误处理，找不到就向下查找，找打了就执行
   */
  
  // read('./name.txt').then(data=>{
  //   return '123'
  // }).then(data=>{
    
  // }).then(null,err=>{
  
  // })
  // // .catch(err=>{ // catch就是没有成功的promise
  
  // // })
  
  /**
   * promise.then实现原理：通过每次返回一个新的promise来实现（promise一旦成功就不能失败，失败就不能成功）
   * 
   */
  
  // function read(data) {
  //   return new myPromise((resolve,reject)=>{
  //     setTimeout(() => {
  //       resolve(new myPromise((resolve,reject)=>resolve(data)))
  //     }, 1000);
  //   })
  // }
  
  // let promise2 = read({name: 'poetry'}).then(data=>{
  //   return data
  // }).then().then().then(data=>{
  //   console.log(data,'-data-')
  // },(err)=>{
  //   console.log(err,'-err-')
  // })
  
  // finally测试
  // myPromise
  //   .resolve(100)
  //   .finally(()=>{
  //     return new myPromise((resolve,reject)=>setTimeout(() => {
  //       resolve(100)
  //     }, 100))
  //   })
  //   .then(d=>console.log('finally success',d))
  //   .catch(er=>console.log(er, 'finally err'))
  
  
  /**
   * promise.all 测试
   * 
   * myPromise.all 解决并发问题 多个异步并发获取最终的结果
  */
  
  // myPromise.all([1,2,3,4,new myPromise((resolve,reject)=>{
  //   setTimeout(() => {
  //     resolve('ok1')
  //   }, 1000);
  // }),new myPromise((resolve,reject)=>{
  //   setTimeout(() => {
  //     resolve('ok2')
  //   }, 1000);
  // })]).then(d=>{
  //   console.log(d,'myPromise.all.resolve')
  // }).catch(err=>{
  //   console.log(err,'myPromise.all.reject')
  // })
  
  
  // 实现promise中断请求
  let promise = new Promise((resolve,reject)=>{
    setTimeout(() => {
      // 模拟接口调用 ajax调用超时
      resolve('成功') 
    }, 10000);
  })
  
  function promiseWrap(promise) {
    // 包装一个promise 可以控制原来的promise是成功 还是失败
    let abort
    let newPromsie = new myPromise((resolve,reject)=>{
      abort = reject
    })
    // 只要控制newPromsie失败，就可以控制被包装的promise走向失败
    // Promise.race 任何一个先成功或者失败 就可以获得结果
    let p = myPromise.race([promise, newPromsie])
    p.abort = abort
  
    return p
  }
  
  let newPromise = promiseWrap(promise)
  
  setTimeout(() => {
    // 超过3秒超时
    newPromise.abort('请求超时')
  }, 3000);
  
  newPromise.then(d=>{
    console.log('d',d)
  }).catch(err=>{
    console.log('err',err)
  })
  
  
  // 使用promises-aplus-tests 测试写的promise是否规范
  // 全局安装 cnpm i -g promises-aplus-tests
  // 命令行执行 promises-aplus-tests promise.js
  // 测试入口 产生延迟对象
  myPromise.defer = myPromise.deferred = function () {
    let dfd = {}
    dfd.promise = new myPromise((resolve,reject)=>{
      dfd.resolve = resolve
      dfd.reject = reject
    })
    return dfd
  }
  
  // 延迟对象用户
  // ![](https://s.poetries.work/images/20210509172817.png)
  // promise解决嵌套问题
  // function readData(url) {
  //   let dfd = myPromise.defer()
  //   fs.readFile(url, 'utf8', function (err,data) {
  //     if(err) {
  //       dfd.reject()
  //     }
  //     dfd.resolve(data)
  //   })
  //   return dfd.promise
  // }
  // readData().then(d=>{
  //   return d
  // })
  
  module.exports = myPromise