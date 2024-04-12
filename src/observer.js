class Observer {
  constructor(name) {
    this.name = name;
  }
  update() {
    console.log(this.name, "收到通知");
  }
}

class Notifier {
  constructor() {
    this.observerList = []; //观察者列表
  }
  add(obj) {
    this.observerList.push(obj); //添加观察者
  }
  remove(obj) {
    let index = this.observerList.findIndex((o) => {
      return o === obj;
    }); //找到 删除对象的索引
    if (index >= 0) {
      this.observerList.splice(index, 1);
    }
  }
  notify() {
    //通知每个观察者
    this.observerList.forEach((obj) => {
      obj.update();
    });
  }
}

let notifier = new Notifier();
let observer1 = new Observer("张三");
let observer2 = new Observer("李四");
notifier.add(observer1);
notifier.add(observer2);

// notifier.remove(observer1); //测试删除
notifier.notify();
