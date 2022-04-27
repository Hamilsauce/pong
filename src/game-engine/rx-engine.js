// const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
// const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { combineLatest, iif, ReplaySubject, AsyncSubject, BehaviorSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { sampleTime, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch } = rxjs.fetch;


export class Game {
  constructor() {
    this.root;

    this.scene$ = combineLatest(
      this.starfield$,
      this.spaceship$,
      this.spaceshipShots$,
      this.enemies$,
      this.score$,
      (stars, spaceship, spaceshipShots, enemies, score) => ({ stars, spaceship, spaceshipShots, enemies, score })
    ).pipe(
      sampleTime(40),
      takeWhile(({ spaceship, enemies }) => this.gameOver(spaceship, enemies) === false)
    )
  }

  init() {
    this.parent.appendChild(this.canvas);
    this.scene$.subscribe(this.render.bind(this))
    return this;
  }

  render({ stars, spaceship, spaceshipShots, enemies, score }) {
    this.paintStars(stars)
    this.paintSpaceship(spaceship)
    this.paintSpaceshipShots(spaceshipShots, enemies)
    this.paintEnemies(enemies)
    this.paintScore(score)
  }


  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}
