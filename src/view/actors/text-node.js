import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils } = ham;
const { race, interval, of , fromEvent, merge, empty, Subject } = rxjs;
const { bufferTime, bufferCount, first, repeat, throttleTime, debounceTime, buffer, switchMap, concatMap, mergeMap, take, filter, scan, takeWhile, startWith, tap, map, mapTo } = rxjs.operators;

// TextNode
export class TextNode {
  constructor(element = document.createElementNS('http://www.w3.org/2000/svg', 'text'), parent) {
    this.parent = parent
  
    this.self = element;
    this.self.nodeValue = 'poop';
    this.self.setAttributeNS(null, 'text-anchor', 'middle');
    this.self.classList.add('text-node'); //to make div fit text
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
    this.textWrapper.setAttribute("height", "100%");
    this.textWrapper.setAttribute('x', this.parent.x)
    this.textWrapper.setAttribute('y', this.parent.centroid.y - 20)
    this.textWrapper.classList.add("node-text-editor-wrapper");

    this.parent.element.removeChild(this.self)
    this.textWrapper.appendChild(this.textEditor)
    this.parent.element.appendChild(this.textWrapper);

    ham.event.selectAllContent(this.textEditor)
    this.textEditor.click()
    this.textEditor.focus()
  }

  editAccept() {
    this.textValue = this.textEditor.innerText;
    this.textWrapper.remove()
    this.parent.element.insertBefore(this.self, this.parent.element.children[this.positionIndex])
  }

  editCancel() {
    this.textValue = this.textValue;
    this.textEditor.onblur = null;
    this.text = null;
    this.textEditor = null;
    this.textWrapper.remove()
    this.parent.element.insertBefore(this.self, this.parent.element.children[this.positionIndex])
    this.self.childNodes[0].nodeValue = textdiv.innerText;
    this.self.setAttribute('display', 'inline-block')
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
    this.self.childNodes[0].nodeValue = this.textValue || ' ';
  }

  get x() { return parseInt(this.self.getAttribute('x')) || 0 }
  set x(newValue) { this.self.setAttribute('x', newValue) }

  get y() { return parseInt(this.self.getAttribute('y')) || 0 }
  set y(newValue) { this.self.setAttribute('y', newValue) }

  get width() { return parseInt(this.self.getAttribute('width')) || 0 }
  set width(newValue) { this.self.setAttribute('width', newValue) }

  get height() { return parseInt(this.self.getAttribute('height')) || 0; } //return this.self.getAttribute('height') }
  set height(newValue) { this.self.setAttribute('height', newValue) }
}
