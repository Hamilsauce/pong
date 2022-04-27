let lastSecond = 0

const animation = () => {
  const date = new Date();

  const hour = date.getHours() % 12;
  const minute = date.getMinutes();
  const second = date.getSeconds();

  if (lastSecond !== second) {
    // console.clear()
    console.log(`${hour}:${minute}:${second} PM`);
  }

  lastSecond = second

  animationFrame(animation);
}

const animationFrame = (fn = animate) => {
  if (animationState.active === true) {
    requestAnimationFrame(fn);
  } else {
    console.warn('ANIMATION DEACTIVED', { animationState });
  }
};

let animationState = {
  _active: false,

  toggleActive() {
    this.active = !this.active;
    return this.active
  },

  get active() { return this._active },

  set active(v) {
    this._active = v;
    if (this.active === true) animationFrame(animation)
  }
};

const start = () => {
  animationState.active = true;
};

const stop = () => {
  animationState.active = false;
};

const toggle = () => {
  animationState.active = false;
};


export const animate = {
  start,
  stop,
  toggle: () => animationState.toggleActive(),
  peak: () => {
    console.warn('animation module: ', { animationState, active: animationState.active });
  }
}
