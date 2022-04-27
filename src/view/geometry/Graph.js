import Line from './Line.js';
import Rect from './Rect.js';
import Vertex from './Vertex.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text, help } = ham;

const { Observable, from, race, interval, of , fromEvent, merge, empty, Subject } = rxjs;
const { bufferTime, bufferCount, first, repeat, throttleTime, debounceTime, buffer, switchMap, mergeMap, take, filter, scan, takeWhile, startWith, tap, map, mapTo } = rxjs.operators;

// const graphMode = 'EDGE' || 'SELECT' || 'DRAW' || 'DELETE'
help('', 'event')
const GRAPH_MODES = [
  ['DRAW', false],
  ['SELECT', false],
  ['EDGE', false],
  ['DELETE', false],
]

export class SelectionStack {
  constructor(element, vertexFill, graphMode = 'DRAW', seedData = []) {

  }
}

// Graph
export default class {
  constructor(element, vertexFill, graphMode = 'DRAW', seedData = []) {
    this._element = element //.parentElement
    // this._element = element.parentElement;
    this.vertexSubjects = { click$: new Subject(), };
    // this._vertices = new VertexCollection(seedData);
    this.optionActionMap = this.initOptionActions();
    this._vertices = new Map();
    this._redoList = [];
    this._selectedVertexZPosition = null;

    this.activeVertex = null; // UNUSED?
    this._focusedVertex = null;

    this.graphModeMap = new Map(GRAPH_MODES)
    this._graphMode;
    this.graphMode = graphMode;

    this.drawMode = 'RECT';
    this._vertexFill = vertexFill || '#ffffff';
    this.edgeDirection = 'UNDIRECTED';

    this.setSvgSize();

    /* * * STREAMS * * */
    this.optionsSubject$ = new Subject();

    this.drawActions$ = {
      start: fromEvent(this.element, 'touchstart').pipe(filter(_ => this.graphMode === 'DRAW'), map(x => this.drawStart(x))),
      move: fromEvent(this.element, 'touchmove').pipe(map(x => this.drawMove(x))),
      end: fromEvent(this.element, 'touchend').pipe(map(x => this.drawEnd(x)), ),
    };

    this.drawSubscription = this.drawActions$.start
      .pipe(
        switchMap(e => this.drawActions$.move.pipe(
          switchMap(e => this.drawActions$.end)))
      ).subscribe();

    /* 
      GRAPH listens for 'vertex:click' events,
      sends updates to nodes by plugging 
      this.vertexSubjects.click$ into
      subscription of 'vertex:click' which nodes are listening on
    */

    this.vertexStateSubscription =
      merge(
        fromEvent(this.element.parentElement, 'vertex:click')
      ).pipe(
        filter(({ detail }) => this.vertices.has(detail.target) && this.graphMode === 'SELECT'),
        map(({ detail }) => this.vertices.get(detail.target)),
        map((node) => {
          this.focusedVertex = this.focusedVertex === node.element || node.activeState !== 'INACTIVE' ? null : node.element
          if (this.focusedVertex === null) return { target: node.element, responseStatus: 'INACTIVE' };
          else return { target: node.element, responseStatus: 'FOCUSED' };
        })
      ).subscribe(this.vertexSubjects.click$)
  }

  /*TODO METHODS  TODO */

  get focusedVertex() { return this._focusedVertex }
  set focusedVertex(newValue) {
    if (![undefined, null].includes(this._focusedVertex)) this.setShapeZPosition(this._focusedVertex, this.vertices.get(this._focusedVertex).zIndex);

    if (this.vertices.has(newValue) && ![undefined, null].includes(newValue)) {
      this._focusedVertex = newValue
      this.setShapeZPosition(this._focusedVertex);
    }
    else this._focusedVertex = null
  }

  setShapeZPosition(vertex, zPosition = null) {
    zPosition = null ? -1 : zPosition;
    const node = this.vertices.get(vertex)
    this.element.insertBefore(node.element, this.element.children[zPosition]);
    // this.current.element.remove()
  }

  resetShapeZPosition() {
    const refNode = this.children[this.vertices.get(this.focusedVertex).zIndex]
    this.element.insertBefore(this.focusedVertex, refNode)
  }


  drawStart(event) {
    event.stopPropagation()
    this.isDrawing = true;

    if (this.drawMode === 'RECT') {
      this.current = this.addVertex(new Vertex(
        {
          x: event.touches[0].pageX, //- event.target.offsetLeft,
          y: event.touches[0].pageY, //- event.target.offsetTop,
          width: 0,
          height: 0,
        },
        this.vertexSubjects,
        this.children.length,
        this.vertexFill,
        this));
        return this.current
    }
  }

  drawMove(event) {
    event.preventDefault();

    if (this.isDrawing && this.drawMode === 'RECT') {
      this.current.setSize({
        width: event.touches[0].pageX - (this.current.x + 30),
        height: event.touches[0].pageY - (this.current.y + 30)
      });
    }
  }

  drawEnd(event) {
    this.isDrawing = false;
    if (!this.current) return;
    if (this.current.width + this.current.height < 40) {
      this.current.element.remove()
    }
    this.current = null;
  }

  getVertexZ(vertex) {
    if (!vertex) return;
    const index = this.children.indexOf(vertex)
    return index === -1 ? null : index;
  }

  handleEdgeMode(e) {
    if (this.addEdgeMode === true && this.vertices.has(e.detail.target)) {
      this.selectedVertices.push(this.vertices.get(e.detail.target))
      this.vertices.get(e.detail.target).value.classList.add('selected-vertex')

      if (this.selectedVertices.length === 2) {
        const [src, dest] = this.selectedVertices

        this.addEdge(src, dest)
        this.addEdgeMode = false;
        this.selectedVertices = [];
      }
    }
  }

  setSvgSize() {
    this.element.setAttributeNS(null, 'width', window.innerWidth);
    this.element.setAttributeNS(null, 'height', window.innerHeight);
  }

  changeGraphMode(incomingMode = '') {
    if (incomingMode !== 'string') return;
    if (this.graphModeMap.has(incomingMode.toUpperCase())) {
      this.graphModeMap.get(this.currentGraphMode) = false;
      this.graphModeMap.get(incomingMode) = true;
    }
  }

  get selectedVerticesMap() {
    return new Map(this.children.filter((ch, i) => {
      return this.vertices.get(ch).isSelected === true
    }).map((ch, i) => [ch, this.vertices.get(ch)]));
  }

  get children() {
    console.log('[...this.element.children[0]]', [...this.element.children[0].children])
    return [...this.element.children[0].children]
  }

  get graphMode() { return this._graphMode }
  set graphMode(newValue) {
    if (this.graphMode === newValue) return;
    this._graphMode = newValue

    if (this.graphMode === 'DRAW') {
      this.focusedVertex = null
      this.selectedVertices.forEach(v => this.setShapeZPosition(v.element, v.zIndex));
      this.vertexSubjects.click$.next({ target: null, responseStatus: 'INACTIVE' })
    }
    else if (['EDGE', 'SELECT'].includes(this.graphMode)) {}
  }

  get redoList() { return this._redoList };
  set redoList(newValue) { this._redoList = newValue };

  get element() { return this._element };
  set element(newValue) { this._element = newValue };

  get vertices() { return this._vertices };
  set vertices(newValue) { this._vertices = newValue };

  get vertexFill() { return this._vertexFill };
  set vertexFill(c) { this._vertexFill = c };

  get selectedVertexZPosition() { return this._selectedVertexZPosition }
  set selectedVertexZPosition(z) { this._selectedVertexZPosition = z };

  get selectedVertices() {
    return this.children
      .filter((ch, i) => this.vertices.get(ch) ? this.vertices.get(ch).isSelected === true : false)
      .map((ch, i) => this.vertices.get(ch));
  };
  set selectedVertices(newValue) { this._selectedVertices = newValue };


  addVertex(vertex) {
    if (this.vertices.has(vertex.element)) {
      return this.vertices.get(vertex.element);
    } else {
      this.vertices.set(vertex.element, vertex);
      this.element.children[0].appendChild(vertex.element);
      return vertex;
    }
  }

  removeVertex(value) {
    const current = this.vertices.get(value);
    if (!current) return;
    for (const vertex of this.vertices.values()) vertex.removeAdjacent(current);
    this.element.removeChild(value)
    return this.vertices.delete(value);
  }

  addEdge(source, destination) {
    const sourceVertex = this.addVertex(source.element);
    const destinationVertex = this.addVertex(destination.element);
    sourceVertex.addAdjacent(destinationVertex);

    if (this.edgeDirection === 'UNDIRECTED') destinationVertex.addAdjacent(sourceVertex);

    const line = new Line({
      x1: sourceVertex.centroid.x,
      y1: sourceVertex.centroid.y,
      x2: destinationVertex.centroid.x,
      y2: destinationVertex.centroid.y,
    }, this._vertexFill, this);

    this.element.appendChild(line.element);
    sourceVertex.edges.set(line.element, { vertexOrder: 0, element: line.element })
    destinationVertex.edges.set(line.element, { vertexOrder: 1, element: line.element })
    return [sourceVertex, destinationVertex];
  }

  removeEdge(source, destination) {
    const sourceVertex = this.vertices.get(source);
    const destinationVertex = this.vertices.get(destination);
    if (!(sourceVertex || destinationVertex)) return;

    sourceVertex.removeAdjacent(destinationVertex);
    if (this.edgeDirection === Graph.UNDIRECTED) destinationVertex.removeAdjacent(sourceVertex)
    return [sourceVertex, destinationVertex];
  }

  deleteVertex() {
    if (this.graphMode === 'SELECT' && this.focusedVertex !== null) {
      this.undo(this.focusedVertex)
    }
  }

  undo(target = null) {
    if (target !== null) {
      const node = this.vertices.get(target)
      this.redoList.push(node)
      this.removeVertex(node.element)
    } else {
      if (this.element.lastChild && this.vertices.has(this.element.lastChild)) {
        const target = this.vertices.get(this.element.lastChild)
        this.redoList.push(target)
        this.removeVertex(target.element)
      }
    }
  }

  redo() {
    if (this.redoList.length > 0) {
      const vertex = this.redoList.pop();
      this.addVertex(vertex.element, vertex) //this.element.appendChild(this.redoList.pop())
    }
  }


  optionAction({ type, data }) {
    if (typeof type != 'string' || !this.optionActionMap.has(type)) return;
    else this.optionActionMap.get(type)(data);
  }

  initOptionActions() {
    return new Map(
      [
        ['draw-mode', (data) => this.drawMode = data],
        ['graph-mode', (data) => this.graphMode = data],
        ['color-selection', (data) => this.vertexFill = data],
        ['undo', (data) => this.undo()],
        ['delete', (data) => this.deleteVertex()],
        ['redo', (data) => this.redo()],
        ['add-edge-mode', (data) => this.addEdgeMode = !this.addEdgeMode],
        ['add-edge-confirm', (data) => this.addEdge(...this.selectedVertices)],
      ]
    );
  }
}

/*TODO FOCUSED VERTEX TODO
 
  - A Vertex is focusedVertex if the 
    vertex is both SELECTED and the 
    MOST RECENTLY SELECTED.
  
  - While a vertex is focused, their element's
    zIndex is moved to the beginning of the
    graph's children collection
    
  - When vertex becomes unfocused, they are 
    repositioned back to their original Z
      
  - A focusedVertex can be unfocused by
    1) A direct deselect, 
    2) By a blur action,
    3) Another vertex being selected
      
  - A focusedVertex acts as the target of
    any applicable user actions while it is focused
  
  - In cases 1) & 2), the outgoing focusedVert
    is not replaced by a new focusedVertex,
    and so no vertex is currently focused
    
  - In 3), the outgoing vertex is
    immediately replaced by a newly foxused vertex 
  
  TODO NOTE: Vertices are not aware of
  Focus states; Only Graph is concerned 
  with and acts according to this.
  
  */
