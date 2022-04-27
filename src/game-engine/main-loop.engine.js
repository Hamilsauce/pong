const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const TestBoxConfig = {
  box: document.getElementById('box'),
  boxPos: 1,
  boxVelocity: 0.08,
  limit: 3000,
  lastFrameTimeMs: 0,
  maxFPS: 60,
  delta: 0,
  timestep: 1000 / 60,
}

class TestBox {
  constructor(config) {
    this.self = config.box;
    this.boxPos = config.boxPos;
    this.boxVelocity = config.boxVelocity;
    this.limit = config.limit;
    this.lastFrameTimeMs = config.lastFrameTimeMs;
    this.maxFPS = config.maxFPS;
    this.delta = config.delta;
    this.timestep = config.timestep;
  }

  update(delta) {
    boxPos += boxVelocity * delta;
    // Switch directions if we go too far
    if (boxPos >= limit || boxPos <= 0) boxVelocity = -boxVelocity;
  }

}
class GameLoop {
  constructor(config) {
    this.box = config.box;
    this.boxPos = config.boxPos;
    this.boxVelocity = config.boxVelocity;
    this.limit = config.limit;
    this.lastFrameTimeMs = config.lastFrameTimeMs;
    this.maxFPS = config.maxFPS;
    this.delta = config.delta;
    this.timestep = config.timestep;

    this.time$ = new BehaviorSubject({ delta: 0 })
  
    
  }
  
  addUpdate(update$) {
    // this.
  }

  draw() {
    
    box.style.left = boxPos + 'px';
  }

}

function update(delta) {
  boxPos += boxVelocity * delta;
  // Switch directions if we go too far
  if (boxPos >= limit || boxPos <= 0) boxVelocity = -boxVelocity;
}

function draw() {
  box.style.left = boxPos + 'px';
}

// function mainLoop(timestamp) {
//   // Throttle the frame rate.    
//   if (timestamp < Engine.lastFrameTimeMs + (1000 / Engine.maxFPS)) {
//     requestAnimationFrame(mainLoop);
//     return;
//   }
//   delta += timestamp - lastFrameTimeMs;
//   lastFrameTimeMs = timestamp;

//   while (delta >= timestep) {
//     update(timestep);
//     delta -= timestep;
//   }
//   draw();
//   requestAnimationFrame(mainLoop);
// }

// requestAnimationFrame(mainLoop);

let lastSecond = 0

const animation = (timestamp) => {
  const date = new Date();

  const hour = date.getHours() % 12;
  const minute = date.getMinutes();
  const second = date.getSeconds();

  Engine.delta += timestamp - Engine.lastFrameTimeMs;
  Engine.lastFrameTimeMs = timestamp;

  console.log(`${hour}:${minute}:${second} PM`);
  while (Engine.delta >= Engine.timestep) {

    if (Math.round(timestamp) % 200 === 0) {
      if (timestamp < Engine.lastFrameTimeMs + (Engine.maxFPS * 10)) {
        requestAnimationFrame(animation);
        // return;
        Engine.updates.forEach((update, i) => {
          // Engine.delta = Engine.delta
          // update(Engine.delta)
          // console.log('Engine.delta ', Engine.delta / 60)
          console.log(`${hour}:${minute}:${second} PM`);
          // Engine.delta -= Engine.timestep;
        });
      }
    }
  }

}


// if (lastSecond !== second) {
// console.clear()


// }

// }

const animationFrame = (fn = animate) => {
  if (Engine.active === true) {
    requestAnimationFrame(fn);
  } else {
    console.warn('ANIMATION DEACTIVED', { Engine });
  }
};

let Engine = Object.assign({
  _active: false,
  updates: [],
  addUpdate(updateFn) {
    this.updates = [...this.updates, updateFn]
  },

  toggleActive() {
    this.active = !this.active;
    return this.active
  },

  get active() { return this._active },

  set active(v) {
    this._active = v;
    if (this.active === true) animationFrame(animation)
  }
}, TestBoxConfig)

const start = () => {
  Engine.active = true;
};

const stop = () => {
  Engine.active = false;
};

const toggle = () => {
  Engine.active = false;
};


export const animate = {
  addUpdate: (fn) => { Engine.addUpdate(fn) },
  start,
  stop,
  toggle: () => Engine.toggleActive(),
  peak: () => {
    console.warn('animation module: ', { Engine, active: Engine.active });
  }
}
