function intersectRect(r1, r2) {
  var r1 = r1.getBoundingClientRect(); //BOUNDING BOX OF THE FIRST OBJECT
  var r2 = r2.getBoundingClientRect(); //BOUNDING BOX OF THE SECOND OBJECT

  //CHECK IF THE TWO BOUNDING BOXES OVERLAP
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}