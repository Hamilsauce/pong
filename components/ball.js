import { Movable } from './Movable.js';

export class Ball extends Movable {
  constructor({ parentSVG, boardGroup, paddles$, attrs }) { //= { fill: 'red', name: 'ball', input$: null, boardHeight: 400 } }) {
    super({ parentSVG, type: 'circle', attrs });
    this.boardGroup = boardGroup;
    this.paddles$ = paddles$
    this.board = document.querySelector('#boardBackground')
    this.transform;
    this.currentPosition;
    this.coord;
    this.directionX = 1
    this.directionY = 0;

    this.anim = requestAnimationFrame(this.animate.bind(this))

    setInterval(() => {

      console.warn('BALL', this);
    }, 2000)
  }

  animate() {
    this.currentPosition = this.updatePosition(this.translate.bind(this))
    requestAnimationFrame(this.animate.bind(this))
  }

  translate() {
    /*
      TODO: REPLACE CHANGES WITH VELOCITY (IN MOVABLE?)
    */
    return ({ x = this.changeX, y = this.changeY, }) => this.directionX === 1 ?
    {
      // x: this.changeX -= 7+ ((this.changeX) / 66),
      x: this.changeX -= 5, //- ((this.changeX)),
      y: this.changeY += this.directionY
    } :
    {
      // x: this.changeX += 5- ((this.changeX) / 66),
      x: this.changeX += 5,// + ((this.changeX)),
      y: this.changeY += this.directionY
    }
  }
}

{
  Ball
}