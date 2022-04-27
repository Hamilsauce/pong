// import {ObserverList} from './ObserverList.js';
import { Observer } from './Observer.js';
import { Subject } from './Subject.js';


export class ObserverSet extends Set {
  constructor(entries) {
    super(entries);
    this.observerList = [];
    this.obs = new Set();
    this.currentIndex = 0;
  }

  resetCurrentIndex() { this.currentIndex = 0 }

  incrementCurrentIndex() { this.currentIndex += 1 }

  add(obj) {
    if (super.has(obj)) return obj;
    return super.add(obj);
  }

  atIndex(index) {
    let el;
    this.resetCurrentIndex();
    if (index > -1 && index < this.size) {

      for (var item of this.values()) {
        if (this.currentIndex === index) {
          el = item;
          break;
        }

        this.incrementCurrentIndex();
      }
      this.resetCurrentIndex();
      return el || null;
    }
  }

  indexOf(obj, startIndex = 0) {
    let i = startIndex;

    for (var item of this.values()) {
      i += 1
      if (obj === item) return i;
    }

    return -1;
  }

  removeAt(index) {
    return super.delete(this.atIndex(index))
  }
}



export class ObserverList {
  constructor() {
    this.observerList = [];
    this.obs = new Set();
  }



  add(obj) {
    // if (this.obs.has(obj)) return this.obs;
    // return this.obs.add(obj);
    return this.observerList.push(obj);
  }
  add2(obj) {
    if (this.obs.has(obj)) return this.obs;
    return this.obs.add(obj);
    // return this.observerList.push(obj);
  }

  get count() {
    return this.observerList.length;
  }

  get(index) {
    if (index > -1 && index < this.count) {
      return this.observerList[index];
    }
  }

  indexOf(obj, startIndex = 0) {
    let i = startIndex;

    while (i < this.count) {
      if (this.observerList[i] === obj) {
        return i;
      }
      i++;
    }

    return -1;
  }

  removeAt(index) {
    this.observerList.splice(index, 1);
  }

}


{ ObserverList }
