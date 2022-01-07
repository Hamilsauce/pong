const { iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;


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


const drawStart = (event) => {
  console.log('this', this)
  event.stopPropagation()
  this.isDrawing = true;
  if (this.drawMode === 'RECT') {
    this.current = this.addVertex(new Vertex(
    {
      x: event.touches[0].pageX, //- event.target.offsetLeft,
      y: event.touches[0].pageY, //- event.target.offsetTop,
      width: 0,
      height: 0,
    }, this.vertexSubjects, this.children.length, this.vertexFill, this))
  }
  return this.current;
}

const drawMove = (event) => {
  event.preventDefault();
  if (this.isDrawing && this.drawMode === 'RECT') {
    this.current.setSize({
      width: event.touches[0].pageX - (this.current.x + 30),
      height: event.touches[0].pageY - (this.current.y + 30)
    });
  }
}

const drawEnd = (event) => {
  this.isDrawing = false;
  if (!this.current) return;
  if (this.current.width + this.current.height < 40) {
    this.element.removeChild(this.current.element)
  }
  this.current = null;
}