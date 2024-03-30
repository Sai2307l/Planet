import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import sky from "../../static/img/stars.jpg";
import sun from "../../static/img/sun.jpg";
import mercuryTexture from "../../static/img/mercury.jpg";
import venusTexture from "../../static/img/venus.jpg";
import saturnTexture from "../../static/img/saturn.jpg";
import saturnRingTexture from "../../static/img/saturn ring.png";
import earthTexture from "../../static/img/earth.jpg";
import neptuneTexture from "../../static/img/neptune.jpg";
import jupiterTexture from "../../static/img/jupiter.jpg";
import marsTexture from "../../static/img/mars.jpg";
import uranusTexture from "../../static/img/uranus.jpg";
import uranusRingTexture from "../../static/img/uranus ring.png";
import plutoTexture from "../../static/img/pluto.jpg";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
// Sets the color of the background
renderer.setClearColor(0x000000);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(6, 8, 14);
orbit.update();

//Set Background Images
const Tloader = new THREE.TextureLoader();
const CTLoader = new THREE.CubeTextureLoader();
scene.background = CTLoader.load([sky, sky, sky, sky, sky, sky]);

// Light
const Spotlight1 = new THREE.SpotLight(0xffae, 100000, 300, Math.PI / 2);
Spotlight1.position.set(0, 30, 0);
Spotlight1.castShadow = true;
scene.add(Spotlight1);
const Spotlight2 = new THREE.SpotLight(0xffae, 100000, 300, Math.PI / 2);
Spotlight2.position.set(0, -30, 0);
Spotlight2.castShadow = true;
scene.add(Spotlight2);

//Helper
// const helper1 = new THREE.SpotLightHelper(Spotlight2);
// scene.add(helper1);
const SPShelper = new THREE.CameraHelper(Spotlight2.shadow.camera);
scene.add(SPShelper);

// Sets a 12 by 12 gird helper
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

// Sets the x, y, and z axes with each having a length of 4
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

//Sun
const sunGeo = new THREE.SphereGeometry(16, 50);
const sunMat = new THREE.MeshBasicMaterial({
  map: Tloader.load(sun),
});
const Sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(Sun);

//Planets
const mercury = CreatePlanet(3.2, mercuryTexture, 28);
const venus = CreatePlanet(5.8, venusTexture, 44);
const earth = CreatePlanet(6, earthTexture, 62);
const mars = CreatePlanet(4, marsTexture, 78);
const jupiter = CreatePlanet(12, jupiterTexture, 100);
const saturn = CreatePlanet(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});
const uranus = CreatePlanet(7, uranusTexture, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture,
});
const neptune = CreatePlanet(7, neptuneTexture, 200);
const pluto = CreatePlanet(2.8, plutoTexture, 216);
// Shadow
function animate() {
  Sun.rotateY(0.004);

  mercury.planet.rotateY(0.004);
  venus.planet.rotateY(0.002);
  earth.planet.rotateY(0.02);
  mars.planet.rotateY(0.018);
  jupiter.planet.rotateY(0.04);
  saturn.planet.rotateY(0.038);
  uranus.planet.rotateY(0.03);
  neptune.planet.rotateY(0.032);
  pluto.planet.rotateY(0.008);

  // Around - sun - rotation;
  mercury.Obj.rotateY(0.04);
  venus.Obj.rotateY(0.015);
  earth.Obj.rotateY(0.01);
  mars.Obj.rotateY(0.008);
  jupiter.Obj.rotateY(0.002);
  saturn.Obj.rotateY(0.0009);
  uranus.Obj.rotateY(0.0004);
  neptune.Obj.rotateY(0.0001);
  pluto.Obj.rotateY(0.00007);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function CreatePlanet(size, texture, pos, ring) {
  const planetGeo = new THREE.SphereGeometry(size, 50, 50);
  const planetMat = new THREE.MeshStandardMaterial({
    map: Tloader.load(texture),
  });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  const Obj = new THREE.Object3D();
  planet.castShadow = true;
  planet.receiveShadow = true;
  planet.position.x = pos;
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshStandardMaterial({
      map: Tloader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const Planetring = new THREE.Mesh(ringGeo, ringMat);
    Planetring.receiveShadow = true;
    Planetring.castShadow = true;
    Planetring.rotateX(Math.PI / 2);
    planet.add(Planetring);
  }
  Obj.add(planet);
  scene.add(Obj);
  return { planet, Obj };
}
