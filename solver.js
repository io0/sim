const R = 10;
const EPS = 1e-3;

const t = (x, y) => Math.atan(y / x); // turn x,y to t, which is indexes a curve
const g = (x, y) => Math.sin(1.5 * t(x, y)); // + 0.5 * Math.sin(7.5 * t(x, y)); // f = g on the boundary

const shortestDistanceToBoundary = (x, y) => {
  // assume center of sphere is (0,0)
  if (x ** 2 + y ** 2 > R ** 2) throw new Error("Bad thing happened");

  return R - Math.sqrt(x ** 2 + y ** 2);
};

const isAtBoundary = (r) => r < EPS;

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
  for (let x = -R; x < R; x++) {
    for (let y = -R; y < R; y++) {
      if (x ** 2 + y ** 2 < R ** 2) {
        if (x != 0 || y != 0) {
          const point = f(x, y, 1);
          soln[[x, y]] = point.mean;
        }
      }
    }
  }
  return soln;
};

// soln = solveLaplace();
// console.log(soln);
