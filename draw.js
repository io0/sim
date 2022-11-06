var path;

// var circle = new paper.Path.Circle({
//   center: view.center,
//   radius: 3,
//   fillColor: "red",
// });

function onMouseDown(event) {
  // If we produced a path before, deselect it:
  if (path) {
    path.selected = false;
  }

  // Create a new path and set its stroke color to black:
  path = new paper.Path({
    segments: [event.point],
    strokeColor: "black",
    // Select the path, so we can see its segment points:
    fullySelected: false,
  });
}

// While the user drags the mouse, points are added to the path
// at the position of the mouse:
function onMouseDrag(event) {
  path.add(event.point);
}

// Solver js

//https://codesandbox.io/s/6l932lljor?file=/src/index.js

// run when document loads
// window.addEventListener("load", (event) => {
var EPSILON = 1e-3;
var canvas = document.getElementById("canvas");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

// const t = (x, y) => Math.atan(y / x); // turn x,y to t, which is indexes a curve
// const g = (x, y) => 1; // Math.sin(t(x, y)); // f = g on the boundary

shortestDistanceToBoundary = function (x, y) {
  var pt = new paper.Point(x, y);
  var nearestPt = path.getNearestPoint(pt);

  return Math.min(pt.getDistance(nearestPt), x, y, WIDTH - x, HEIGHT - y);
};

isAtBoundary = function (r) {
  return r < EPSILON;
};

sampleFAtPoint = function (x, y, i) {
  var r = shortestDistanceToBoundary(x, y); // Find the distance to the boundary
  // console.log(r);
  // circle.position = new paper.Point(x, y);
  if (isAtBoundary(r)) {
    // TODO: Can change this to more complicated g.
    // here, g = 1 on the path, 0 on the box
    console.log(i);
    if (
      x < EPSILON ||
      y < EPSILON ||
      x > WIDTH - EPSILON ||
      y > HEIGHT - EPSILON
    ) {
      return 0;
    } else {
      return 1;
    }
  } else {
    var angle = 2 * Math.PI * Math.random();
    var newX = x + r * Math.cos(angle);
    var newY = y + r * Math.sin(angle);
    return sampleFAtPoint(newX, newY, i + 1);
  }
};

// const f = (x, y, N) => {
//   let sum = 0;
//   let sumSquares = 0;
//   let sample;
//   for (let i = 0; i < N; i++) {
//     sample = sampleFAtPoint(x, y);
//     sum += sample;
//     sumSquares += sample ** 2;
//   }
//   const mean = sum / N;
//   return {
//     mean,
//     var: (N / ((N - 1) * N)) * Math.sqrt(sumSquares - mean ** 2),
//   };
// };

solveLaplaceOneIter = function () {
  var soln = {};
  for (var x = 0; x < WIDTH; x++) {
    for (var y = 0; y < HEIGHT; y++) {
      var point = sampleFAtPoint(x, y, 0);
      soln[[x, y]] = point;
    }
    if (x % 10 == 0) {
      console.log(x);
    }
  }
  return soln;
};

// When the mouse is released, we simplify the path:
function onMouseUp(event) {
  // When the mouse is released, simplify it:
  path.closed = true;
  path.simplify(10);
  path.fillColor = new Color(1, 0, 0);
  // soln = solveLaplaceOneIter();
  // console.log(soln);
}
