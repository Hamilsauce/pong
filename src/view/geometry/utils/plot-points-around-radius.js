const points =(count, radius, offset = 0) =>{
  const angle = 360 / count;
  const vertexIndices = range(count);

  return vertexIndices.map(index => {
    return {
      theta: offset + degreesToRadians(offset + angle * index),
      r: radius,
    };
  });
}

// number => [0, 1, 2, ... number]
const range =(count) =>{
  return Array.from(Array(count).keys());
}

const degreesToRadians =(angleInDegrees) =>{
  return (Math.PI * angleInDegrees) / 180;
}

const polygon =(noOfSides, circumradius, rotation, [cx = 0, cy = 0]) =>{
  return points(noOfSides, circumradius, rotation)
    .map(pt => toCartesian(pt, [cx, cy]))
    .join(' ');
}

const toCartesian =({ r, theta }, [cx, cy]) =>{
  return [cx + r * Math.cos(theta), cy + r * Math.sin(theta)];
}
