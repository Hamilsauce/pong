export class Field {
  constructor() {
    this.name;
    this.records = [
      { id: null, value: null },
    ]


  };
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

const ColumnarDB = {

}“
x”“ y”“ health”“ color”
soldier1
31
27
3850
soldier2
49
67
1891
beacon1
55
10“ red”
beacon2
12
84“ green”

values = {}
values["x"] = {}
values["y"] = {}
values["n"] = {}
values["x"]["a"] = 3.14
values["y"]["a"] = 2.71
values["n"]["b"] = "no"
values["y"]["b"] = "yes"
