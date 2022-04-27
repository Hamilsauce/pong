import { ObserverSet } from './ObserverList.js';
import { Observer } from './Observer.js';

export class Subject {
  constructor() {
    this.subs = new ObserverSet();

  }

  subscribe = function(observer) {
    this.subs.add(observer);
  }

  unsubscribe = function(observer) {
    return this.subs.delete(observer)
  }

  emit = function(context) {
    for (var item of this.subs.values()) {
    console.log('item', item)
      item.update(context);
    }
  }

  // get observerCount() { return this.subs.count.bind(this)}
}



// export class Subject {
//   constructor() {
//     this._subs = new ObserverList();
//     this._subset = new ObserverSet();
//   }

//   subscribe = function(observer) {
//     this.observers.add(observer);
//   }

//   unsubscribe = function(observer) {
//     this.observers.removeAt(this.observers.indexOf(observer, 0));
//   }

//   emit = function(context) {
//     const observerCount = this.observers.count;
//     // const observerCount = this.observersCount;
//     for (let i = 0; i < observerCount; i++) {
//       this.observers.get(i).update(context);
//     }
//   }

//   // get observerCount() { return this.observers.count.bind(this)}
// }

{ Subject }
