import { ControllerBase } from '...'

export class InputController {
  constructor() {
    //  ...Capture and translate UI/user events
  };
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}