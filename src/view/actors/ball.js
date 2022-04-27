import { Movable } from './Movable.js';

export class Ball extends Movable {
  constructor({ canvas, boardGroup, paddles$, attrs }) { //= { fill: 'red', name: 'ball', input$: null, boardHeight: 400 } }) {
    super({ canvas, type: 'circle', attrs });
    this.boardGroup = boardGroup;
    this.paddles$ = paddles$
    this.board = document.querySelector('#boardBackground')
    this.transform;
    this.currentPosition;
    this.coord;
    this.directionX = 'left'
    this.directionY = 0;

    this.anim = requestAnimationFrame(this.animate.bind(this))
  }

  animate() {
    this.currentPosition = this.updatePosition(this.translate.bind(this))
    requestAnimationFrame(this.animate.bind(this))
  }

  translate() {
    /*
      TODO: REPLACE CHANGES WITH VELOCITY (IN MOVABLE?)
    */
    return ({ x = this.changeX, y = this.changeY, }) => this.directionX === 'left' ?
    {
      x: this.changeX -= 3,
      y: this.changeY += this.directionY
    } :
    {
      x: this.changeX += 3,
      y: this.changeY += this.directionY
    }
  }
}

{
  Ball
}
