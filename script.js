const app = document.querySelector('.app');
const appbody = document.querySelector('.app-body');

const ALPHABET = (new Array('Z'.charCodeAt() - 'A'.charCodeAt() + 1)
    .fill(0).map((v, i) => ('A'.charCodeAt() + 1) + i))
  .map(x => String.fromCharCode(x));

const configureSvg = (el, index, ...attrs) => {
  attrs.forEach(([key, value], i) => {
    el.setAttributeNS(null, key, value);
  });
  return el;
};


const makeSvgElement = (svgParent, type = 'rect', config = {}) => {
  const rect = configureSvg(svgParent.createSVGRect(), Object.entries(config))
  const idIncrement = ALPHABET[svgParent.children.length]
  const id = svgParent.getAttributeNS(null, 'id');




};

const svg = document.createElementNS(SVG_NS, 'svg');
svg.setAttributeNS(null, 'x', 0);
svg.setAttributeNS(null, 'y', 0);
svg.setAttributeNS(null, 'width', 200);
svg.setAttributeNS(null, 'height', 200);
svg.setAttributeNS(null, 'fill', '#00ff00');
svg.setAttributeNS(null, 'id', 'rect1');
svg.style.zIndex = 500;

console.log('svg.get id', svg.getAttributeNS(null, 'id'))

// const idIncrement = charCodeAt(svg.children.length)
// console.log('idIncrement', idIncrement)
const rectEl = document.createElementNS(SVG_NS, 'rect');

const rect1 = svg.createSVGRect();
const rect1a = svg.createSVGRect()
console.log('rect1', rect1)
console.log('rectEl', rectEl)
console.log('rect1a', rect1a)


rect1.appendChild(rect1a)
svg.appendChild(rect1)
appbody.appendChild(svg)

rect1.setAttribute( 'x', 0);
rect1.setAttributeNS(null, 'y', 0);
rect1.setAttributeNS(null, 'width', 200);
rect1.setAttributeNS(null, 'height', 200);
rect1.setAttributeNS(null, 'fill', '#00ff00');
rect1a.setAttributeNS(null, 'x', 0);
rect1a.setAttributeNS(null, 'y', 0);
rect1a.setAttributeNS(null, 'height', 159);
rect1a.setAttributeNS(null, 'width', 159);
rect1a.setAttributeNS(null, 'fill', '#ff0000');


svg.style.zIndex = 500;


// // const sliderContainers = document.querySelectorAll('.slider-container')
// const footer = document.querySelector('.container')
// // const controlsSvg = document.querySelector('#controls')
// // const sliders = controlsSvg.querySelectorAll('.slider-group')
// // const slider1 = sliders[0]

// // const handle = slider1.querySelector('.slider-circle') //.firstElementChild
// // const path = slider1.querySelector('.slider-rect1') //.firstElementChild
// // let pathHeight = Math.round(parseInt(path.getAttributeNS(null, 'height')));
// // console.log('pathHeight', pathHeight)



// let cr = Math.round(parseInt(handle.getAttributeNS(null, 'r')));
// handle.setAttributeNS(null, 'cy', (pathHeight / 2) + cr)
// let cy = Math.round(parseInt(handle.getAttributeNS(null, 'cy')));
// // let cy = (handle.getAttributeNS(null, 'cy'));
// console.log('cy', cy)

// let startY;
// const handlePointerDown = (e) => {
//   startY = getMousePosition(e).y
//   e.target.addEventListener('pointermove', handlePointerMove)
// }



// function getMousePosition(evt) {
//   let CTM = controlsSvg.getScreenCTM();
//   if (evt.touches) { evt = evt.touches[0]; }
//   return {
//     x: (evt.clientX - CTM.e) / CTM.a,
//     y: (evt.pageY - CTM.f) / CTM.d
//   };
// }

// const handlePointerMove = (e) => {
//   const transforms = e.target.transform.baseVal;
//   const translate = controlsSvg.createSVGTransform();

//   const moveY = getMousePosition(e).y
//   const cx = Math.round(parseInt(e.target.getAttributeNS(null, 'cx')));
//   const cy = Math.round(parseInt(e.target.getAttributeNS(null, 'cy')));
//   const changeY = (moveY - startY);
//   console.log('moveY, changeY, cy)', moveY, changeY, cy)


//   // translate.setTranslate(0, changeY);
//   if (cy + changeY  >= 0 && changeY - cy <= 180) {


//   translate.setTranslate(0, (changeY));
//   transforms.insertItemBefore(translate, 0);
//   }

//   // e.target.setAttributeNS(null, 'cy', ey)
// }
// const handlePointerUp = (e) => {}


// sliders.forEach((slider, i) => {
//   const rect1 = slider.querySelector('.slider-rect1');
//   handle.addEventListener('pointerdown', handlePointerDown)

//   // circle.addEventListener('input', e => {
//   //   e.preventDefault()
//   //   output.textContent = e.target.value;
//   // });
// });



// // sliderContainers.forEach((con, i) => {
// //   const slider = con.querySelector('.slider-control');
// //   const output = con.querySelector('.slider-value-output');

// //   slider.addEventListener('input', e => {
// //     e.preventDefault()

// //     output.textContent = e.target.value;
// //   });
// // });