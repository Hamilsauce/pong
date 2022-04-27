export const coordinates = {
  cartesianToPolar({ x, y }) {
    return {
      r: Math.sqrt(x * x + y * y),
      theta: Math.atan2(y, x)
    };
  },

  polarToCartesian({ r, theta }) {
    return {
      x: r * Math.cos(theta),
      y: r * Math.sin(theta)
    };
  }
}
