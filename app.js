import { Game } from './components/Game.js';

const sliderConfig = [
  {
    x: 60,
    y: 450,
    width: 50,
    height: 225,
    handleRadius: 25,
    strokeWidth: 1,
    id: 'left',
    key1: 'duck'
  },
  {
    x: 290,
    y: 450,
    width: 50,
    height: 225,
    handleRadius: 25,
    strokeWidth: 1,
    id: 'right',
    key2: 'suck'
  },
];

const game = new Game('#game', { sliderConfig });