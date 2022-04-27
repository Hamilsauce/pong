import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils } = ham;
const { race, interval, of , fromEvent, merge, empty, Subject } = rxjs;
const { bufferTime, bufferCount, first, repeat, throttleTime, debounceTime, buffer, switchMap, concatMap, mergeMap, take, filter, scan, takeWhile, startWith, tap, map, mapTo } = rxjs.operators;

// TextNode
export default class {
  constructor(textNode = document.createElementNS('http://www.w3.org/2000/svg', 'text'), parent) {
    this.parent = parent
  
    this.element = textNode;
    this.element.nodeValue = 'poop';
    this.element.setAttributeNS(null, 'text-anchor', 'middle');
    this.element.setAttributeNS(null, 'font-folder', '1px');
    this.element.classList.add('text-node'); //to make div fit text
    this._textValue = 'Text'
    this.text = document.createTextNode(this.textValue);
    this._editMode = false;

    this.textWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    this.textEditor = document.createElement("div");

    this.blurSubscription = of (this.editMode)
      .pipe(
        mergeMap(editMode =>
          fromEvent(this.textEditor, 'blur')
          .pipe(
            filter(x => this.editMode === true),
            map(evt => {
              this.editMode = false;
              return { eventType: 'blur', event: evt }
            })
          )
        ),
      ).subscribe()
  }

  editText(text) {
    this.textEditor.appendChild(this.text);
    this.textEditor.setAttribute("contentEditable", "true");
    this.textEditor.setAttribute("width", `${this.parent.width}px`)
    this.textEditor.classList.add('node-text-editor'); //to make div fit text

    this.textWrapper.setAttribute("width", this.parent.width);
    this.textWrapper.setAttribute("height", 10);
    this.textWrapper.setAttribute('x', this.parent.x)
    this.textWrapper.setAttribute('y', this.parent.centroid.y - 20)
    this.textWrapper.classList.add("node-text-editor-wrapper");

    this.parent.element.removeChild(this.element)
    this.textWrapper.appendChild(this.textEditor)
    this.parent.element.appendChild(this.textWrapper);

    ham.event.selectAllContent(this.textEditor)
    this.textEditor.click()
    this.textEditor.focus()
  }

  editAccept() {
    this.textValue = this.textEditor.innerText;
    this.textWrapper.remove()
    this.parent.element.insertBefore(this.element, this.parent.element.children[this.positionIndex])
  }

  editCancel() {
    this.textValue = this.textValue;
    this.textEditor.onblur = null;
    this.text = null;
    this.textEditor = null;
    this.textWrapper.remove()
    this.parent.element.insertBefore(this.element, this.parent.element.children[this.positionIndex])
    this.element.childNodes[0].nodeValue = textdiv.innerText;
    this.element.setAttribute('display', 'inline-block')
  }

  get editMode() { return this._editMode };
  set editMode(newValue) {
    this._editMode = newValue
    if (this.editMode === true) this.editText(this.textValue || 'Text here...')
    else this.editAccept()
  };

  get textValue() { return this._textValue };
  set textValue(newValue) {
    this._textValue = newValue
    this.element.childNodes[0].nodeValue = this.textValue || ' ';
  }

  get x() { return parseInt(this.element.getAttribute('x')) || 0 }
  set x(newValue) { this.element.setAttribute('x', newValue) }

  get y() { return parseInt(this.element.getAttribute('y')) || 0 }
  set y(newValue) { this.element.setAttribute('y', newValue) }

  get width() { return parseInt(this.element.getAttribute('width')) || 0 }
  set width(newValue) { this.element.setAttribute('width', newValue) }

  get height() { return parseInt(this.element.getAttribute('height')) || 0; } //return this.element.getAttribute('height') }
  set height(newValue) { this.element.setAttribute('height', newValue) }
}
