// Move to cartesian coordinates x,y
function move(pathArray, x, y) {
  pathArray.push('M', x, y);
}

// Draw a line to polar coordinates defined by radius and angle
function linePolar(pathArray, radius, angle) {
  pathArray.push('L',
    radius * Math.cos(angle * Math.PI / 180),
    radius * Math.sin(angle * Math.PI / 180)
  );
}


var pathD = [];

move(pathD, 0, 0);
linePolar(pathD, 1, 45);
linePolar(pathD, 1, 120);
linePolar(pathD, 1.5, 200);
linePolar(pathD, 1, 270);

mypath = document.getElementById("mypath");
mypath.setAttribute("d", pathD.join(' '));

// .path {
//   fill: lightblue;
//   stroke: black;
//   stroke - width: 0.02 px;
// }
// <svg width="300" viewBox="-2 -2 4 4">
//   <path id="mypath" d="" />
// </svg>
