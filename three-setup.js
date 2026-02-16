import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

let scene, camera, renderer, model, controls;

init();
animate();

function init() {
  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0x202020); // dark gray, but lighter than 0x0a0a0a


  // ===== CAMERA =====
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 2, 6); // moved back a bit to fit scaled model

  // ===== RENDERER =====
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // enable shadows
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById("chipCanvas").appendChild(renderer.domElement);
  // document.getElementById("chipCanvas2").appendChild(renderer.domElement);

  // ===== ORBIT CONTROLS =====
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(0, 0, 0);
  controls.update();

  // ===== LIGHTS =====
  // Ambient light for base brightness
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Key light (main directional)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1);
  keyLight.position.set(5, 10, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  // Fill light (softens shadows)
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
  fillLight.position.set(-5, 5, -5);
  scene.add(fillLight);

  // Rim/back light
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
  rimLight.position.set(0, 5, -5);
  scene.add(rimLight);

  // ===== LOAD MODEL =====
  loadModel();

  window.addEventListener("resize", onResize);
}

function loadModel() {
  const mtlLoader = new MTLLoader();
  mtlLoader.load("./js/untitled.mtl", (materials) => {
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);

    objLoader.load("./js/untitled.obj", (obj) => {
      model = obj;

      // ===== CENTER MODEL =====
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);

      // ===== SCALE MODEL =====
      model.scale.set(2, 2, 2); // increase size (adjust as needed)

      // Enable shadows if desired
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(model);
    });
  });
}

function animate() {
  requestAnimationFrame(animate);

  // OPTIONAL: slow auto-rotation
  // if (model) model.rotation.y += 0.005;

  controls.update();
  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
