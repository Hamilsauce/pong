/* 
   Makes an element in an SVG document draggable.
   Fires custom `dragstart`, `drag`, and `dragend` events on the
   element with the `detail` property of the event carrying XY
   coordinates for the location of the element.
*/

const draggable = (parent, element) => {
  const svg = parent
  const handle = element.querySelector('.slider-handle');

  // if (!selector) return console.error('draggable() needs an element');
  while (svg && svg.tagName != 'svg') svg = svg.parentNode;
  // console.log('13', { svg });
  if (!svg) return console.error(el, 'must be inside an SVG wrapper');
  let pt = svg.createSVGPoint();
  let doc = svg.ownerDocument;

  const root = doc.rootElement || doc.body || svg;
  let xlate, txStartX, txStartY, pointerStart;
  let xforms = handle.transform.baseVal;

  svg.addEventListener('pointerdown', startMove, false);
  svg.addEventListener('pointermove', handleMove, false);
  svg.addEventListener('pointerup', finishMove, false);

  function startMove(evt) {
    // We listen for pointermove/up on the root-most
    // element in case the pointer is not over svg.
    // svg.addEventListener('pointermove', handleMove, false);
    // svg.addEventListener('pointerup', finishMove, false);

    // Ensure that the first transform is a translate()
    xlate = xforms.numberOfItems > 0 && xforms.getItem(0);
    if (!xlate || xlate.type != SVGTransform.SVG_TRANSFORM_TRANSLATE) {
      xlate = xforms.createSVGTransformFromMatrix(svg.createSVGMatrix());
      xforms.insertItemBefore(xlate, 0);
    }
    txStartX = xlate.matrix.e;
    txStartY = xlate.matrix.f;
    pointerStart = inElementSpace(evt);
    fireEvent('dragstart');
  }

  function handleMove(evt) {
    const point = inElementSpace(evt);
    xlate.setTranslate(
      txStartX + point.x - pointerStart.x,
      txStartY + point.y - pointerStart.y
    );
    fireEvent('drag');
    // console.log('handleMove', handleMove)
  }

  function finishMove(evt) {
    // svg.removeEventListener('pointerup', finishMove, false);
    // svg.removeEventListener('pointermove', handleMove, false);
    fireEvent('dragend');
  }

  function fireEvent(eventName) {
    const event = new Event(eventName);
    event.detail = { x: xlate.matrix.e, y: xlate.matrix.f };
    return svg.dispatchEvent(event);
  }

  // Convert pointer position from screen space to coordinates of el
  function inElementSpace(evt) {
    console.log('svg.parentNode', svg)
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }
}