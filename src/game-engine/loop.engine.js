// import {}from''

let lastSecond = 0
let activeEntity
let dest = { x: 4, y: 4 }
let curr = { x: 0, y: 0 }
let reqid
let done = false

async function animate(tstamp) {
  const date = new Date();
  const millis = date.getMilliseconds();
  // console.table([curr,dest]);
  const xDiff = Math.round(dest.x - curr.x)
  const yDiff = Math.round(dest.y - curr.y)
  // console.log('xDiff, yDiff', xDiff,yDiff)

  const xDir = (dest.x - curr.x) - 0.08 > 0 ?
    'east' : (dest.x - curr.x) + 0.08 < 0 ? 'west' : 'stay'

  const yDir = (dest.y - curr.y) - 0.08 > 0 ?
    'south' : (dest.y - curr.y) + 0.08 < 0 ? 'north' : 'stay'


  // 'south' : 'north'
  // console.log(target.getAttribute("transform"))
  // const
  const changeXA = Math.abs(Math.round(dest.x) - Math.round(curr.x))
  // console.log('digfs', xDir, yDir);

  // const changeYA = Math.abs(Math.floor(dest.y) - Math.ceil(curr.y))
  const changeY = Math.ceil(dest.y) - Math.floor(curr.y)
  // console.log('changeY', changeY)
  // console.log('changeX', changeXA)
  // if (Math.abs(xDiff) <= Math.abs(dest.x) - 0.0) {

  if (xDir === 'east') {
    // console.log('x', xDiff, dest.x);
    // if (xDir === 'east' && dest.x + 0.05 <= curr.x / 2) {
    // curr.x = Math.floor(curr.x) + 0.08
    // curr.x = Math.fround(curr.x + 0.08)
    // const trans = curr.x = Math.fround(curr.x + 0.08)
    curr.x = Math.fround(curr.x + 0.08)
    activeEntity.setAttribute("transform", `translate(${(Math.floor((curr.x)))},${(curr.y)})`)
  }

  // else if (xDir === 'west' && dest.x + 0.05 < curr.x /2 ) {
  else if (xDir === 'west' && Math.abs(xDiff) <= Math.abs(dest.x)) {
    const changeX = Math.min(Math.floor(dest.x) - Math.floor(curr.x), 1)
    // console.log(changeX);
    curr.x = Math.ceil(curr.x - 0.08)
    // curr.x -= 0.08
    activeEntity.setAttribute("transform", `translate(${(curr.x)},${(curr.y-0.0)})`)
  }

  // }

  // && Math.abs(yDiff) > Math.abs(dest.y)) {
  // console.log('y', yDiff, dest.y);

  if (yDir === 'south' && Math.abs(yDiff) <= Math.abs(dest.y)) {
    // curr.y += 0.07
    curr.y = Math.fround(curr.y + 0.08)
    activeEntity.setAttribute("transform", `translate(${(curr.x)},${(curr.y-0.0)})`)
  }

  else if (yDir === 'north') { //&& dest.y + 0.05 <= curr.y / 2) {
    // curr.y -= 0.08
    curr.y = Math.fround(curr.y - 0.08)
    activeEntity.setAttribute("transform", `translate(${(curr.x)},${(curr.y-0.00)})`)
  }


  else {
    curr.x = dest.x
    curr.y = dest.y

    // cancelAnimationFrame(reqid)
    // return;
    // }
  }
  // if (curr.x === dest.x && curr.y === dest.y ) {
  // }
  reqid = requestAnimationFrame(animate);


}

// const 

export const instruct = async (el, p) => {
  dest = { x: p.x, y: p.y }

  // const steps = {y: 

  // start(el, dest)
  await requestAnimationFrame(animate);
};


export const start = async (el, targetDest) => {
  activeEntity = el
  // return (...points)=>  instruct(activeEntity,)
  // let x = dest.x >= p.x ? -(dest.x - p.x) : (dest.x - p.x)
  // let y = dest.y >= p.y ? -(dest.y - p.y) : (dest.y - p.y)
  let { x, y } = targetDest
  dest = { x, y }
  // console.log('leavinf atart');
  // console.log({ activeEntityDest });
  instruct(activeEntity, dest)
  return true
};
