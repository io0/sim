const R = 10;
const EPSILON = 1e-3;

const t = (x, y) => Math.atan(y / x); // turn x,y to t, which is indexes a curve
const g = (x, y) => Math.sin(t(x, y)); // f = g on the boundary

const shortestDistanceToBoundary = (x, y) => {
  // assume center of sphere is (0,0)
  if (x ** 2 + y ** 2 > R ** 2) throw new Error("Bad thing happened");

  return R - Math.sqrt(x ** 2 + y ** 2);
};

const isAtBoundary = (r) => r < EPSILON;

const sampleFAtPoint = (x, y) => {
  const r = shortestDistanceToBoundary(x, y); // Find the distance to the boundary
  if (isAtBoundary(r)) {
    return g(x, y);
  } else {
    const angle = 2 * Math.PI * Math.random();
    const newX = x + r * Math.cos(angle);
    const newY = y + r * Math.sin(angle);
    return sampleFAtPoint(newX, newY);
  }
};

const f = (x, y, N) => {
  let sum = 0;
  let sumSquares = 0;
  let sample;
  for (let i = 0; i < N; i++) {
    sample = sampleFAtPoint(x, y);
    sum += sample;
    sumSquares += sample ** 2;
  }
  const mean = sum / N;
  return {
    mean,
    var: (N / ((N - 1) * N)) * Math.sqrt(sumSquares - mean ** 2),
  };
};

const solveLaplace = () => {
  const soln = {};
  for (let x = 0; x < R; x++) {
    for (let y = 0; y < R; y++) {
      if (x ** 2 + y ** 2 < R ** 2) {
        const point = f(x, y, 1000);
        soln[(x, y)] = point.mean;
      }
    }
  }
  return soln;
};

soln = solveLaplace();
