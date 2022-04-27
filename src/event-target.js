export class EventEmitter extends EventTarget {
  #events;
  constructor() {
    this.#events = new Map();
  }

  on(type, handler) {
    if (this.hasEvent(type)) {
      this.#events.set(type, [...this.#events.get(type), handler])
    } else {
      this.#events.set(type, [handler])
    }
  }

  hasEvent(type) {
    return this.#events.has(type)
  }

  addEvent(type, ...handlers) {
    if (this.hasEvent(type)) return
    return this.#events.set(type, handlers);
  }

  getEvent(type) {
    return this.#events.get(type);
  }

  off() {}

  once() {}

  emit(type, ...data) {
    const handlers = this.#events.get(type);
    handlers.forEach((h, i) => {
      h(...data);
    });
  }
}


class MyEventTarget extends EventTarget {
  constructor(mySecret) {
    super();
    this._secret = mySecret;
  }

  get secret() { return this._secret; }
};

let myEventTarget = new MyEventTarget(5);
let value = myEventTarget.secret; // == 5
myEventTarget.addEventListener("foo", function(e) {
  this._secret = e.detail;
});

let event = new CustomEvent("foo", { detail: 7 });
myEventTarget.dispatchEvent(event);
let newValue = myEventTarget.secret; // == 7