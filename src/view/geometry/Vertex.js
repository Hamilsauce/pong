import Node from '../models/Node.model.js';
import TextNode from './TextNode.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text, help } = ham;
const { from, race, interval, of , fromEvent, merge, empty, Subject } = rxjs;
const { bufferTime, bufferCount, bufferWhen, first, repeat, throttleTime, debounceTime, buffer, switchMap, concatMap, mergeMap, take, filter, scan, takeWhile, startWith, tap, map, mapTo } = rxjs.operators;

// const intervalEvents = interval(1000);
// const buffered = intervalEvents.pipe(bufferWhen(() => clicks));
// buffered.subscribe(x => console.log(x));



const _SVG_NS = 'http://www.w3.org/2000/svg';

const vertexType = {
  rect: 'rect',
  circle: 'circle',
}

// VERTEX
export default class extends Node {
  constructor(pos, vertexSubjects, zIndex, color, graph, fill = '#ffffff', stroke = '#000000', type = 'rect') {
    super(document.createElementNS(_SVG_NS, 'g'));
    this.element = this.value
    this.graph = graph;
    this.shape = document.createElementNS(_SVG_NS, type)
    this.textNode = new TextNode(document.createElementNS('http://www.w3.org/2000/svg', 'text'), this);
    this.edges = new Map();
    this.zIndex = zIndex;

    this._isSelected;
    this.isSelected = false;
    this._isFocused;
    this.isFocused = false;

    // this.isFocused.pipe(tap(x => console.log('heard isFocused chsnge pipe!', x)), ).subscribe()
    this.init(pos, color);

    this._activeState = {
      value: 'INACTIVE',
      value$: new Subject(),
      isNewStateValid: (v) => ['INACTIVE', 'SELECTED', 'FOCUSED'].includes(v),
      validStates: ['INACTIVE', 'SELECTED', 'FOCUSED'],
    }

    this.activeState$.pipe(
      filter((newState) => this._activeState.isNewStateValid(newState)),
      map(state => {
        if (state === 'INACTIVE') {
          this.isSelected = false;
          this.isFocused = false;
        } else if (state === 'SELECTED') {
          this.isSelected = true;
          this.isFocused = false;
        } else if (state === 'FOCUSED') {
          this.isSelected = true;
          this.isFocused = true;
        }
        return state;
      }),
    ).subscribe()


    /*  TODO CLICK STREAMS  */

    this.clickSubscription = fromEvent(this.element, 'click').pipe(tap(e => e.preventDefault()))
      .pipe(
        bufferTime(400),
        filter(_ => _.length),
        map(evts => ({ type: evts.length > 1 ? 'dblclick' : 'click', target: this.element, event: evts[evts.length - 1] })),
        map((e) => {
          if (e.type === 'dblclick') this.textNode.editMode = !this.textNode.editMode;
          else if (e.type === 'click') this.element.dispatchEvent(new CustomEvent('vertex:click', { bubbles: true, detail: { target: this.element } }));
          return e;
        }),
      ).subscribe();

    this.graphClickResponse$ = vertexSubjects.click$
      //TODO clickResponse$ is the response/feedback
      //TODO fromGraph after emitting 'vertexClick'
      .pipe(
        map(({ responseStatus, target }) => this.setActiveState(this.isEventSource(target) ? responseStatus : 'INACTIVE')), );

    this.vertexSelectSubscription = this.graphClickResponse$.subscribe(this.activeState$);


    /*  TODO TOUCH STREAMS  */
    this.pointerdown$ = fromEvent(this.element, 'pointerdown').pipe(
      filter(({ currentTarget }) => this.activeState === 'FOCUSED'),
      tap(() => this.isActive = true),
      tap(() => this.isFocused = true),
      map(evt => evt),
    );
    this.pointermove$ = fromEvent(this.element, 'pointermove').pipe(
      filter(({ currentTarget }) => this.activeState === 'FOCUSED' && this.isEventSource(currentTarget)),
      map(e => {
        if (!this.isSelected) this.isActive = false;
        return this.isActive ? e : null
      }),
      map(e => {
        if (!this.isActive || e == null) return;
        this.setCoords(this.getMousePosition(e))
        return e;
      }),
    );
    this.pointerup$ = fromEvent(this.element, 'pointerup').pipe(
      map(e => {
        this.isActive = false;
        return { x: this.x, y: this.y }
      }),
    );

    this.pointerSubscription = this.pointerdown$.pipe(
      switchMap(() => this.pointermove$.pipe(
        switchMap(() => this.pointerup$)))
    ).subscribe();

    this.blurSubscription =
      merge(fromEvent(this.element, 'blur'), fromEvent(this.shape, 'blur'), )
      .pipe(
        filter(x => this.isSelected === true),
        map(() => this.setActiveState('INACTIVE')),
      ).subscribe()
  }

  /* TODO  End Constructor  TODO */

  getMousePosition(evt) {
    var CTM = this.shape.getScreenCTM();
    if (evt.touches) {} else {
      return {
        x: ((evt.clientX - CTM.e) / CTM.a) - (this.width / 2), // - parseInt(this.x),
        y: ((evt.clientY - CTM.f) / CTM.d) - (this.height / 2), // - parseInt(this.y),
      };

    }
  }

  init(pos, color) {
    this.classList('add', 'vertex', )
    this.element.dataset.nodeType = 'rect'
    this.element.dataset.nodeId = 'node1'
    this.shape.classList.add('rect');
    this.shape.setAttributeNS(null, 'stroke-width', '2');
    this.shape.setAttributeNS(null, 'stroke', '#00000090');
    this.shape.setAttribute('fill', color);
    this.textNode.element.classList.add('vertex-text')
    this.textNode.element.textContent = ' '
    this.textNode.element.setAttributeNS(null, 'text-anchor', 'middle');
    this.element.appendChild(this.shape);
    this.element.appendChild(this.textNode.element);
    this.setCoords(pos);
    this.setSize(pos);
  }

  setActiveState(status = '') {
    this.activeState = status;
    return this.activeState
  }

  get activeState() { return this._activeState.value }
  set activeState(newState) {
    if (this.activeState !== newState && this._activeState.isNewStateValid(newState)) { //&& this._activeState.isNewStateValid(newState)) {
      this._activeState.value = newState;
      this._activeState.value$.next(this.activeState);
    } //else  console.log('activeState didnt chsnge, no emit, line 213 vertex');
  }
  get activeState$() { return this._activeState.value$.asObservable() }

  isEventSource(target) {
    return target ? [this.element, this.shape].includes(target) : null
  }

  classList(keyword, ...classes) {
    if (classes.length === 0 || !['add', 'remove'].includes(keyword)) return;
    this.element.classList[keyword](...classes)
    // this.shape.classList[keyword](...classes)
    if (!this.element.classList.contains('selected-vertex')) {
      this.shape.classList.remove(...classes)
    }
  }

  setRotate(angle) {
    let newPos = pos = this.position;
    newPos.x2 = pos - radius * Math.cos(angle);
    newPos.y2 = pos - radius * Math.sin(angle);
    this.setPosition(newPos);
  }

  setCoords({ x, y }) {
    this.x = x
    this.y = y
    this.shape.setAttributeNS(null, 'x', x);
    this.shape.setAttributeNS(null, 'y', y);
    this.textNode.element.setAttributeNS(null, 'x', this.centroid.x - ((parseInt(this.textNode.element.getAttributeNS(null, 'width')) || 0) / 2))
    this.textNode.element.setAttributeNS(null, 'y', this.centroid.y + ((parseInt(this.textNode.element.getAttributeNS(null, 'height')) || 0) / 2));
  }

  setSize({ width, height }) {
    this.width = width
    this.height = height
  }

  getTextAttribute(attr) {}
  setTextAttribute(attr, value) {
    this.textNode.element.setAttribute('x', this.centroid.x - ((parseInt(this.textNode.element.getAttribute('width')) || 0) / 2))
    this.textNode.element.setAttribute('y', this.centroid.y + ((parseInt(this.textNode.element.getAttribute('height')) || 0) / 2));
  }

  updateTextPosition(alignment = 'center') {
    this.textNode.element.setAttribute('x', this.centroid.x)
    this.textNode.element.setAttribute('y', this.centroid.y)
  }

  get isSelected() { return this._isSelected }
  set isSelected(newValue) {
    this._isSelected = newValue
    this.classList(this.isSelected ? 'add' : 'remove', 'selected-vertex')
  }

  get isFocused() { return this._isFocused }
  set isFocused(newValue) {
    this._isFocused = newValue
  }

  get centroid() {
    return {
      x: (this.x + this.width / 2) || 0,
      y: (this.y + this.height / 2) || 0,
    }
  }

  get size() { return { width: this.width, height: this.height, } }

  get coords() {
    return { x: this.x, y: this.y, }
  }

  get position() { return { x: this.x, y: this.y, width: this.width, height: this.height, } }
  set position({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get x() { return parseInt(this.shape.getAttributeNS(null, 'x')) || 0 }
  set x(newValue) {
    this.shape.setAttributeNS(null, 'x', newValue)
    this.updateTextPosition();
  }

  get y() { return parseInt(this.shape.getAttributeNS(null, 'y')) || 0 }
  set y(newValue) {
    this.shape.setAttributeNS(null, 'y', newValue)
    this.updateTextPosition();
  }

  get width() { return parseInt(this.shape.getAttribute('width')) || 0 }
  set width(newValue) {
    this.shape.setAttribute('width', newValue)
    this.updateTextPosition();
  }

  get height() { return parseInt(this.shape.getAttribute('height')) || 0; }
  set height(newValue) {
    this.shape.setAttribute('height', newValue)
    this.updateTextPosition();
  }
}
