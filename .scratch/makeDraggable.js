let makeDraggable = (function() {
  function makeDraggable(svg, element) {
    let selected = false;

    let transforms = element.transform.baseVal;
    let transforms2 = element.transform.baseVal;
    if (transforms.length === 0) { // || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
      let translate = svg.createSVGTransform();
      let translate2 = svg.createSVGTransform();
      translate.setTranslate(0, 0);
      translate.setTranslate(0, 0);
      transforms.insertItemBefore(translate, 0);
      console.log('element.transform.baseVal', element.transform.baseVal)
    }

    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('touchstart', startDrag);
    svg.addEventListener('touchmove', drag);
    svg.addEventListener('touchend', endDrag);

    function getMousePosition(evt) {
      let CTM = svg.getScreenCTM();
      if (evt.touches) { evt = evt.touches[0]; }
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
      };
    }

    function startDrag(evt) {
      selected = element;
      transform = transforms.getItem(0);

      // Get initial translation
      offset = getMousePosition(evt);
      offset.x -= transform.matrix.e;
      offset.y -= transform.matrix.f;
    }

    function drag(evt) {
      if (selected) {
        evt.preventDefault();
        let coord = getMousePosition(evt);
        transform.setTranslate(coord.x - offset.x, coord.y - offset.y);
      }
    }

    function endDrag(evt) {
      selected = false;
    }

    function zoom(evt) {
      evt.stopPropagation();
      evt.preventDefault();

      let scaleStep = evt.wheelDelta > 0 ? 1.25 : 0.8;

      let newMatrix = currentZoomMatrix.multiply(matrix);
      container.transform.baseVal.initialize(svg.createSVGTransformFromMatrix(newZoomMatrix));
    }
  }

  return {
    byClassName: function(className) {
      // Get SVGs
      document.querySelectorAll('svg').forEach(function(svg) {
        // Get elements
        let elements = svg.getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
          makeDraggable(svg, elements[i]);
        }
      });
    },
    byElements: function(svg, elements) { makeDraggable(svg, elements) },
  };
})();
