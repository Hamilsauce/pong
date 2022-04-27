const convert = {
  convertCoords(x, y, elem) {
    const offset = this.root.getBoundingClientRect();
    const matrix = elem.getScreenCTM();
    return {
      x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
      y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
    };
  },
  
  makeAbsoluteContext(element, svgDocument) {
    return function(x, y) {
      const offset = svgDocument.getBoundingClientRect();
      const matrix = element.getScreenCTM();
      return {
        x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
        y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
      };
    };
  }
}