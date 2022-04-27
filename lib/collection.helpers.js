export const range = (start, stop) => {
  return new Array(stop - start)
    .fill(0)
    .map((v, i) => start + i);
}

export const promisify = (fn) => {
  // promisify(fn)(...args) => promise
  return (...args) =>
    new Promise((resolve, reject) =>
      fn(...args, (err, data) => (err ? reject(err) : resolve(data)))
    );
}