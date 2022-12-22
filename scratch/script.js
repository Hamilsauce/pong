export class SliderGroup {
  constructor(parentSvg, config) {
    this.parentSvg = parentSvg;

  };
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

const app = document.querySelector('.app');
const controlsSvg = document.querySelector('#controls')
const sliderGroup = controlsSvg.querySelector('.slider-group')

const track = sliderGroup.querySelector('.slider-track'); //.firstElementChild
const trackY1 = parseInt(track.getAttributeNS(null, 'y1'))
const trackY2 = parseInt(track.getAttributeNS(null, 'y2'))
const handle = sliderGroup.querySelector('.slider-handle') //.firstElementChild
const sliderBackground = sliderGroup.querySelector('.slider-bg') //.firstElementChild


let trackHeight = parseInt(track.getAttributeNS(null, 'height'));
// console.log('trackHeight,trackY1', trackHeight,trackY1)



let handleRadius = Math.round(parseInt(handle.getAttributeNS(null, 'r')));
handle.setAttributeNS(null, 'cy', (handleRadius))
let handleInitY = parseInt(handle.getAttributeNS(null, 'cy'));
// let cy = (handle.getAttributeNS(null, 'cy'));
// const handle =

console.log('handleInitY, trackY1, trackY2', handleInitY, trackY1, trackY2)

let startY;
let offset;
let handleTransform;
let handleTransforms = handle.transform.baseVal;

if (handleTransforms.length === 0) {
  // || handleTransforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
  // Create an handleTransform that translates by (0, 0)
  var translate = controlsSvg.createSVGTransform();
  translate.setTranslate(0, 0);
  // element.transform.baseVal 
  handleTransforms.insertItemBefore(translate, 0);
  console.log('element.transform.baseVal', handle.transform.baseVal)
}


const handlePointerDown = (e) => {
  startY = getMousePosition(e).y
  console.log('startY', startY)
  // controlsSvg.addEventListener('pointermove', handlePointerMove)
}


function getMousePosition(evt) {
  let CTM = controlsSvg.getScreenCTM();
  if (evt.touches) { evt = evt.touches[0]; }
  return {
    x: (evt.clientX - CTM.e) / CTM.a,
    y: (evt.pageY - CTM.f) / CTM.d
  };
}


// const handlePointerMove = (e) => {
//   // const handleTransforms = e.target.transform.baseVal;
//   handleTransforms = handle.transform.baseVal;
//   const translate = controlsSvg.createSVGTransform();

//   const moveY = getMousePosition(e).y
//   const cx = Math.round(parseInt(handle.getAttributeNS(null, 'cx')));
//   const cy = Math.round(parseInt(handle.getAttributeNS(null, 'y')));
//   const changeY = (moveY - startY);

//   console.log('moveY, changeY, cy)', moveY, changeY, cy)

//   // translate.setTranslate(0, changeY);
//   translate.setTranslate(0, (changeY));
//   handleTransforms.insertItemBefore(translate, 0);
//   if (cy + changeY >= 0 && changeY - cy <= 180) {}

//   // e.target.setAttributeNS(null, 'cy', ey)
// }
// const handlePointerUp = (e) => {}

controlsSvg.addEventListener('pointerdown', startDrag)
controlsSvg.addEventListener('pointermove', drag)
controlsSvg.addEventListener('pointerup', endDrag)
// controlsSvg.addEventListener('pointerdown', handlePointerDown)
// controlsSvg.addEventListener('pointermove', handlePointerDown)
// controlsSvg.addEventListener('pointerup', handlePointerDown)

let selected;

function startDrag(evt) {
  selected = handle;
  handleTransform = handleTransforms.getItem(0);

  // Get initial translation
  offset = getMousePosition(evt);
  offset.x -= handleTransform.matrix.e;
  offset.y -= handleTransform.matrix.f;
}

let accumulatedTranslation = 0 + handleInitY;

function drag(evt) {
  // console.log('accumulatedTranslation', accumulatedTranslation);
  var coord = getMousePosition(evt);
  const changedY = coord.y - offset.y;
  accumulatedTranslation = accumulatedTranslation + (changedY - accumulatedTranslation)

  // console.log('coord.y, offset.y, trackY1, trackY2', coord.y, offset.y,trackY1, trackY2)
  console.log('changedY', changedY);

  // if (selected) {
  if (changedY + trackY1 >= trackY1 && changedY <= trackY2) {}
  evt.preventDefault();
  handleTransform.setTranslate(0, coord.y - offset.y);
  // }
}

function endDrag(evt) {
  selected = false;
}



// controlsSvg.addEventListener('input', e => {
//   e.preventDefault()
//   output.textContent = e.target.value;
// });
// });



// sliderGroupContainers.forEach((con, i) => {
//   const sliderGroup = con.querySelector('.slider-control');
//   const output = con.querySelector('.slider-value-output');

//   controlsSvg.addEventListener('input', e => {
//     e.preventDefault()

//     output.textContent = e.target.value;
//   });
// });