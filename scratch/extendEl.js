class MyEl extends HTMLElement {
  constructor() {
    super()
  };
  get prop() { return this._prop };
  set prop(newValue) {
    this._prop = newValue
  };
}

let el = new HTMLElement('pop')
console.log('MyEl',el)