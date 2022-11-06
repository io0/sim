import * as THREE from "three";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { ParametricGeometries } from "three/examples/jsm/geometries/ParametricGeometries.js";

// import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { ArcballControls } from "three/examples/jsm/controls/ArcballControls.js";

var renderer;
var scene;
var camera;
var graphGeometry;

var id;

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
  iters++; // global
  // console.log(averages);
  // for (let i = 0; i < segments; i++) {
  //   updateMeshVertex(i, 0, Math.random());
  // }
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      let x = xMin + i * xInterval;
      let y = yMin + j * yInterval;
      if (withinBound(x, y)) {
        if (x != 0 || y != 0) {
          const result = sampleFAtPoint(x, y);
          // console.log(result, x, y);
          z = updateAndReturnAverage(i, j, result);
          updateMeshVertex(i, j, 10 * z);
        }
      }
    }
  }
  // updateVertices(graphMesh.geometry);
  graphMesh.geometry.attributes.position.needsUpdate = true;
  // graphMesh.geometry.normalsNeedUpdate = true;
  // graphMesh.geometry.verticesNeedUpdate = true;
  renderer.render(scene, camera);
}

var material = new THREE.MeshNormalMaterial();
function withinBound(x, y) {
  if (x < -5) {
    return false;
  }
  if (x > 5) {
    return false;
  }
  if (y > 5) {
    return false;
  }
  if (y < -5) {
    return false;
  }
  return true;
}

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
  camera.position.x = 15;
  camera.position.y = 16;
  camera.position.z = 13;
  camera.lookAt(scene.position);

  // create a renderer, set the background color and size
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 0.5);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const controls = new ArcballControls(camera, renderer.domElement, scene);

  controls.addEventListener("change", function () {
    renderer.render(scene, camera);
  });

  // add the output of the renderer to the html element
  const container = document.getElementById("ThreeJS");
  container.appendChild(renderer.domElement);

  createGraph();
  // drawMesh();
  // call the render function
  renderer.render(scene, camera);
  animate();
}

var numSlices = 10, // For both x and y, square grid
  dim = numSlices + 1,
  xMin = -10,
  xMax = 10,
  xRange = xMax - xMin,
  xInterval = xRange / dim; // is it dim or numSlices?
(yMin = -10), (yMax = 10), (yRange = yMax - yMin), (yInterval = yRange / dim); // check this
//zMin = -10,
//zMax = 10,
//zRange = zMax - zMin;

let graphMesh;

function drawMesh() {
  var geometry = new THREE.PlaneGeometry(60, 60, 199, 199);
  // console.log(geometry.vertices);

  var vertices = geometry.attributes.position.array;
  // apply height map to vertices of plane
  for (i = 0, j = 2; i < 199 * 199 * 10; i += 4, j += 3) {
    vertices[j] = Math.random() * 5;
  }

  var wireMaterial = new THREE.MeshPhongMaterial({
    color: 0xdddddd,
    wireframe: true,
  });

  var plane = new THREE.Mesh(geometry, wireMaterial);
  plane.rotation.x = -Math.PI / 2;

  scene.add(plane);
}
let iters = 0;
const averages = {};
function updateAndReturnAverage(i, j, val) {
  if (averages[[i, j]]) {
    averages[[i, j]] = (averages[[i, j]] * (iters - 1)) / iters + val / iters;
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
    if (withinBound(x, y)) {
      const result = sampleFAtPoint(x, y);
      z = result;
    }
    // if (isNaN(z)) return new THREE.Vector3(0, 0, 0); // TODO: better fix
    target.set(x, y, z);
  };

  // true => sensible image tile repeat...
  graphGeometry = new ParametricGeometry(
    meshFunction,
    numSlices,
    numSlices,
    true
  );
  console.log(graphGeometry.attributes);
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
