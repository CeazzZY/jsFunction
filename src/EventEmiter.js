class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(type, listener, isUnshift) {
    if (!this.events) {
      this.events = {};
    }
    if (this.events[type]) {
      if (isUnshift) {
        this.events.unshift(listener);
      } else {
        this.events.push(listener);
      }
    } else {
      this.events = [listener];
    }
  }
  emit(type, ...arg) {
    if (this.events[type])
      this.events[type].forEach((cb) => cb.call(this, ...arg));
  }
  off(type, listener) {
    if (this.events[type]) {
      const index = this.events[type].indexOf(listener);
      this.events[type].splice(index, 1);
    }
  }
  once(type, listener, isUnshift) {
    const _this = this;
    const onceFn = function (...arg) {
      listener.call(this,...arg);
      _this.off(type, onceFn);
    };
    _this.on(type, onceFn, isUnshift);
  }
}
