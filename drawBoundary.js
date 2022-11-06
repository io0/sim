var path;
var A = [];

// var circle = new paper.Path.Circle({
//   center: view.center,
//   radius: 3,
//   fillColor: "red",
// });

//// The curve parameterised boundary value
//function boundaryValue(t) {
//  return 2 + Math.sin(t);
//}
//
// Get the boundary value function evaluated at the closeste point on the bd to x,y
//function g(x, y, path) {
//  let t = path.getNearestLocation(new Point(x, y)).time;
//}

function onMouseDown(event) {
  // If we produced a path before, deselect it:

  if (path) {
    path.remove();
    // path.selected = false;
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
var EPSILON = 1.9;
var canvas = document.getElementById("canvas");
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

// const t = (x, y) => Math.atan(y / x); // turn x,y to t, which is indexes a curve
// const g = (x, y) => 1; // Math.sin(t(x, y)); // f = g on the boundary

// Function, ideal defined by user, that returns value of boundary condition
gOfT = function (time) {
  var theta = 2 * Math.PI * time;
  return 0.5 * (2 + Math.sin(3 * theta));
  // return 1;
};

// Evaluates g(time) at the nearest point on boundary to x,y parameturized by time in [0,1]
gOfXY = function (x, y) {
  // return 1;
  var pt = new paper.Point(x, y);
  var time = path.getNearestLocation(pt).time; // value between 0 and 1
  return gOfT(time);
};

shortestDistanceToBoundary = function (x, y) {
  var pt = new paper.Point(x, y);
  var nearestPt = path.getNearestPoint(pt);

  return Math.min(pt.getDistance(nearestPt), x, y, WIDTH - x, HEIGHT - y);
};

getDistanceMatrix = function () {
  for (var i = 0; i < WIDTH; i++) {
    A[i] = [];
  }

  for (var x = 0; x < WIDTH; x++) {
    for (var y = 0; y < HEIGHT; y++) {
      A[x][y] = shortestDistanceToBoundary(x, y);
    }
  }
};

isAtBoundary = function (r) {
  return r < EPSILON;
};

sampleFAtPoint = function (x, y) {
  var r = A[Math.floor(x)][Math.floor(y)]; // var r = shortestDistanceToBoundary(x, y); // Find the distance to the boundary
  // console.log(r);
  // circle.position = new paper.Point(x, y);
  // console.log(r);
  if (isAtBoundary(r)) {
    // TODO: Can change this to more complicated g.
    // here, g = 1 on the path, 0 on the box
    if (
      x < EPSILON ||
      y < EPSILON ||
      x > WIDTH - EPSILON ||
      y > HEIGHT - EPSILON
    ) {
      return 0; // if it's at the boundary, return0
    } else {
      //console.log("Boundary value is ", gOfXY(x,y));
      return gOfXY(x, y); // return boundary value g(x,y)
    }
  } else {
    var angle = 2 * Math.PI * Math.random();
    var newX = Math.floor(x + r * Math.cos(angle));
    var newY = Math.floor(y + r * Math.sin(angle));
    return sampleFAtPoint(newX, newY);
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

// solveLaplaceOneIter = function () {
//   var soln = {};
//   var point;
//   for (var x = 0; x < WIDTH; x++) {
//     for (var y = 0; y < HEIGHT; y++) {
//       point = sampleFAtPoint(x, y);
//       soln[[x, y]] = point;
//     }
//     if (x % 10 == 0) {
//       console.log(x);
//     }
//   }
//   return soln;
// };

// When the mouse is released, we simplify the path:
function onMouseUp(event) {
  // When the mouse is released, simplify it:
  var splineTolerance = 25;
  path.simplify(splineTolerance);
  getDistanceMatrix();
  // soln = solveLaplaceOneIter();
  // console.log(soln);
}
