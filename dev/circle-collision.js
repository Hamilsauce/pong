//////////// COLLISION ALGO FROM MDN
/* 
var circle1 = {radius: 20, x: 5, y: 5};
var circle2 = {radius: 12, x: 10, y: 5};

var dx = circle1.x - circle2.x;
var dy = circle1.y - circle2.y;
var distance = Math.sqrt(dx * dx + dy * dy);

if (distance < circle1.radius + circle2.radius) {
    // collision detected!
}
*/

// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection



const collider = {
  moveableDiv: null,
  staticDivs: [],
  checkCollision: function() {
    let hasJustCollided = false;
    for (let i = 0; i < this.staticDivs.length; i++) {
      const currentDiv = this.staticDivs[i];
      const dx = currentDiv.position.left - this.moveableDiv.position.left;
      const dy = currentDiv.position.top - this.moveableDiv.position.top;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < currentDiv.position.radius + this.moveableDiv.position.radius) {
        hasJustCollided = true;
        if (!this.moveableDiv.ref.classList.contains('collision-state')) {
          this.moveableDiv.ref.classList.add('collision-state');
        }
      } else if (this.moveableDiv.ref.classList.contains('collision-state') && !hasJustCollided) {
        this.moveableDiv.ref.classList.remove('collision-state');
      }
    }
  },
};


// the prototype for my base div
window.BaseDiv = function(div) {
  this.position = {
    left: div.getBoundingClientRect().left,
    top: div.getBoundingClientRect().top,
    radius: div.getBoundingClientRect().height / 2,
  };
}


window.MoveDiv = function(ref) {
  this.ref = ref;
  BaseDiv.call(this, ref);
}

MoveDiv.prototype.moveOnKeyPress = function(e) {
  switch (e.which) {
    case 37:
      this.shiftPosition(-5, 0);
      break;
    case 38:
      this.shiftPosition(0, -5);
      break;
    case 39:
      this.shiftPosition(5, 0);
      break;
    case 40:
      this.shiftPosition(0, 5);
      break;
    default:
      console.log('not an arrow');
      break;
  }
}

MoveDiv.prototype.shiftPosition = function(x, y) {
  this.position.left += x;
  this.position.top += y;
  this.reDraw(this.ref, this.position);
}

MoveDiv.prototype.reDraw = function(ref, position) {
  ref.setAttribute('style', `left: ${position.left}px; top: ${position.top}px`);
  collider.checkCollision();
}



function setup() {
  const container = document.querySelector('.container');

  // create a bunch of random divs
  for (let i = 0; i < 100; i++) {
    const newStaticDiv = document.createElement('div');
    newStaticDiv.setAttribute('style', `left: ${Math.floor(Math.random() * 400)}px; top: ${Math.floor(Math.random() * 600)}px;`);
    container.appendChild(newStaticDiv);
    newStaticDiv.classList.add('collideme');
    collider.staticDivs.push(new BaseDiv(newStaticDiv));
  }

  // create the moveable div
  const newMoveableDiv = document.createElement('div');
  newMoveableDiv.setAttribute('style', 'left: 500px; top: 500px;');
  newMoveableDiv.setAttribute('id', 'divtwo');
  newMoveableDiv.classList.add('collideme');
  container.appendChild(newMoveableDiv);
  collider.moveableDiv = new MoveDiv(newMoveableDiv);

  document.addEventListener('keydown', (e) => collider.moveableDiv.moveOnKeyPress(e));
};

setup();