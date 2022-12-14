import * as THREE from "three";
import { ParametricGeometry } from "https://unpkg.com/three@0.146.0/examples/jsm/geometries/ParametricGeometry.js";
import { ParametricGeometries } from "https://unpkg.com/three@0.146.0/examples/jsm/geometries/ParametricGeometries.js";

// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { OrbitControls } from "https://unpkg.com/three@<version>/examples/jsm/controls/OrbitControls.js";

import { ArcballControls } from "https://unpkg.com/three@0.146.0/examples/jsm/controls/ArcballControls.js";
import { FirstPersonControls } from "https://unpkg.com/three@0.146.0/examples/jsm/controls/FirstPersonControls.js";

var renderer;
var scene;
var camera;
var graphGeometry;
var controls;
var arccontrols;
var shouldComputeF = false;
var canv = document.getElementById("canvas");
console.log(canv.width);
console.log(canv.height);
// Define a bunch of glob vars
var numSlices = 40, // For both x and y, square grid
  dim = numSlices + 1,
  xMin = -10,
  xMax = 10,
  xRange = xMax - xMin,
  xInterval = canv.width / dim, // is it dim or numSlices?
  yMin = -10,
  yMax = 10,
  yRange = yMax - yMin,
  yInterval = canv.height / dim; // check this
//zMin = -10,
//zMax = 10,
//zRange = zMax - zMin;

var id;
const clock = new THREE.Clock();

function animate() {
  id = requestAnimationFrame(animate);
  render();
}

function updateMeshVertex(i, j, z) {
  // convert index to mesh index
  const index = 3 * (dim * i + j) + 2; // dim is both the width and height
  var vertices = graphMesh.geometry.attributes.position.array;
  vertices[index] = z;
}
function render() {
  if (shouldComputeF) {
    console.log(shouldComputeF);
    iters++; // global
    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        let x = i * xInterval;
        let y = j * yInterval;
        // console.log(x, y);
        // if (withinBound(x, y)) {
        // if (x != 0 || y != 0) {
        const result = sampleFAtPoint(x, y);
        // console.log(result, x, y);
        let z = updateAndReturnAverage(i, j, result);
        updateMeshVertex(i, j, 7 * z); // temp scaling factor multiplying z
        // }
        // }
      }
    }
    // updateVertices(graphMesh.geometry);
    graphMesh.geometry.attributes.position.needsUpdate = true;
    graphMesh.geometry.computeVertexNormals();
    graphMesh.geometry.normalsNeedUpdate = true;
  }
  // controls.update(clock.getDelta());
  // graphMesh.geometry.verticesNeedUpdate = true;
  renderer.render(scene, camera);
}

var material = new THREE.MeshNormalMaterial({
  side: THREE.DoubleSide,
});
// function withinBound(x, y) {
//   if (x ** 2 + y ** 2 >= R ** 2) {
//     return false;
//   }
//   return true;
// }

function init() {
  // create a scene, that will hold all our elements
  // such as objects, cameras and lights.
  scene = new THREE.Scene();
  // create a camera, which defines where we looking at.
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  // position and point the camera to the center
  camera.position.x = 20;
  camera.position.y = 21;
  camera.position.z = 30;
  camera.lookAt(scene.position);

  // create a renderer, set the background color and size
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xbdc4ff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // scene.fog = new THREE.Fog(0x000000, 0.1, 5);

  const near = 0;
  const far = 40;
  const color = "red";

  // scene.fog = new THREE.FogExp2(0xefd1b5, 0.0025);
  // add the output of the renderer to the html element
  const container = document.getElementById("ThreeJS");
  container.appendChild(renderer.domElement);

  createGraph();
  // drawMesh();
  // call the render function

  controls = new FirstPersonControls(camera, renderer.domElement, scene);
  // controls.activeLook = false;
  controls.movementSpeed = 0.01;
  controls.lookSpeed = 0.002;
  controls.constrainVertical = true;

  const arccontrols = new ArcballControls(camera, renderer.domElement, scene);

  arccontrols.addEventListener("change", function () {
    renderer.render(scene, camera);
  });
  arccontrols.setGizmosVisible(false);
  // controls.verticalMax = (1 * Math.PI) / 1;
  // controls.verticalMin = Math.PI / 2;
  renderer.render(scene, camera);
  animate();
}

let graphMesh;
let iters = 0;
const averages = {};
const movingAverageDecay = 0.995;
function updateAndReturnAverage(i, j, val) {
  if (averages[[i, j]]) {
    // averages[[i, j]] = (averages[[i, j]] * (iters - 1)) / iters + val / iters;
    averages[[i, j]] =
      averages[[i, j]] * movingAverageDecay + val * (1 - movingAverageDecay);
  } else {
    averages[[i, j]] = val;
  }
  return averages[[i, j]];
}

function updateVertices(graphGeometry) {
  var vertices = graphGeometry.attributes.position.array;
  // apply height map to vertices of plane
  for (i = 0, j = 2; i < 199 * 199 * 10; i += 4, j += 3) {
    vertices[j] = 0;
  }
}
function createGraph() {
  iters += 1;
  xRange = xMax - xMin;
  yRange = yMax - yMin;
  // zFunc = 0;
  const meshFunction = function (x_, y_, target) {
    let x = xRange * x_ + xMin;
    let y = yRange * y_ + yMin;
    // var z = Math.cos(x_);
    var z = 0;
    // if (withinBound(x, y)) {
    // const result = 0; // sampleFAtPoint(x, y);
    // console.log(result, x, y);
    // z = result;
    // }
    // if (isNaN(z)) return new THREE.Vector3(0, 0, 0); // TODO: better fix
    target.set(x, y, z);
  };

  // true => sensible image tile repeat...
  graphGeometry = new ParametricGeometry(meshFunction, numSlices, numSlices);
  // console.log(graphGeometry.attributes);
  // material choices: vertexColorMaterial, wireMaterial , normMaterial , shadeMaterial

  // if (graphMesh) {
  //   scene.remove(graphMesh);
  //   // renderer.deallocateObject( graphMesh );
  // }
  graphMesh = new THREE.Mesh(graphGeometry, material);
  graphMesh.doubleSided = true;

  graphMesh.rotation.x = -Math.PI / 2;
  scene.add(graphMesh);

  /**
   *
   *
   * asjdfkljklajsdfkl
   */
  const geometry = new ParametricGeometry(ParametricGeometries.klein, 25, 25);
  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const klein = new THREE.Mesh(geometry, material);
  // scene.add(klein);
  // updateVertices(graphGeometry);
}

window.onload = init;
window.onmouseup = () => {
  // controls.addEventListener("change", function () {
  //   renderer.render(scene, camera);
  // });
  shouldComputeF = true;
  console.log({ shouldComputeF });
};
