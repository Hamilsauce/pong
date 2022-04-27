class MoverMaker {
  constructor() {
    this.root;
  }
  
  static getSwipeDirection() {}
  static move() {}
  
  static makeMovable(swipeTarget, moveTarget) {
   let swipeStartXY = {x: null, y: null}
    if (!(swipeTarget && moveTarget)) return;
    
    swipeTarget.addEventListener('pointerdown', e => {
      swipeStartXY = {x: e.x, y: e.y}
      
    swipeTarget.addEventListener('pointerdown', this.pointerDown)
    });
  }
  static pointerDown() {}
  static pointerMove() {}
  static pointerUp() {}
  
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}