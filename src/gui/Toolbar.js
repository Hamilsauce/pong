import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text } = ham;

export class ToolbarConfig {
  constructor(options = []) {
    this._options = options;
  };
  get options() { return this._options };
  set options(newValue) { this._options = newValue };
}

// TOOLBAR
export default class myClass {
  constructor(element, optionsConfig) {
    this.root;
  };
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}