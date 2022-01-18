var makeDraggable = (function() {
  function makeDraggable(svg, element) {
    var selected = false;
    const controlsSvg = document.querySelector('#controls')
    const sliderGroup = controlsSvg.querySelector('.slider-group')

    const track = sliderGroup.querySelector('.slider-track') //.firstElementChild
    const trackY1 = parseInt(track.getAttribute('y1')) //NS (null, 'y1'))
    const trackY2 = parseInt(track.getAttribute('y2')) //NS (null, 'y2'))
    const handle = sliderGroup.querySelector('.slider-handle') //.firstElementChild
    const sliderBackground = sliderGroup.querySelector('.slider-bg') //.firstElementChild


    let trackHeight = parseInt(track.getAttribute('height')) //NS (null, 'height'));
    // console.log('trackHeight,trackY1', trackHeight,trackY1)

    let handleRadius = Math.round(parseInt(handle.getAttribute('r'))); //NS (null, 'r')));
    handle.setAttributeNS(null, 'cy', (handleRadius));
    let handleInitY = parseInt(handle.getAttribute('cy')) //NS (null, 'cy'));

    // Make sure the first transform on the element is a translate transform
    // console.log('element.transform.baseVal', element.transform)
    var transforms = element.transform.baseVal;

    if (transforms.length === 0) { // || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
      // Create an transform that translates by (0, 0)
      var translate = svg.createSVGTransform();
      translate.setTranslate(0, 0);
      // element.transform.baseVal 
      transforms.insertItemBefore(translate, 0);
      // console.log('element.transform.baseVal', element.transform.baseVal)
    }

    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('touchstart', startDrag);
    svg.addEventListener('touchmove', drag);
    svg.addEventListener('touchend', endDrag);

    function getMousePosition(evt) {
      var CTM = svg.getScreenCTM();
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
      console.log('offset.y', offset.y)
    }

    function drag(evt) {
      // console.log('offset', offset)

      if (selected) {

        evt.preventDefault();
        var elementY = parseInt(element.getAttribute('cy')) //NS (null, 'cy'));
        var elementRadius = parseInt(element.getAttribute('r')) //NS (null, 'r'));
        var elementCenter = elementY - elementRadius
        var coord = getMousePosition(evt);
        let changeY = coord.y - offset.y

        if (changeY + 18 >= trackY1 && changeY + 18 <= 186) {
          transform.setTranslate(0, changeY);
        }
      }
    }

    function endDrag(evt) { selected = false }

    function zoom(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      var scaleStep = evt.wheelDelta > 0 ? 1.25 : 0.8;
      var newMatrix = currentZoomMatrix.multiply(matrix);
      container.transform.baseVal.initialize(svg.createSVGTransformFromMatrix(newZoomMatrix));
    }
  }

  return {
    byClassName: function(className) {
      document.querySelectorAll('svg').forEach(function(svg) {
        var elements = svg.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
          makeDraggable(svg, elements[i]);
        }
      });
    },
    byElements: function(svg, elements) { makeDraggable(svg, elements) },
  };
})();