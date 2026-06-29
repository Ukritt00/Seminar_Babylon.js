import './style.css'
import javascriptLogo from './assets/javascript.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { setupCounter } from './counter.js'

import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

//////////////////////////////////////////////////////--Variables --////////////////////////////////////////////////////// 
let logData = [];

//////////////////////////////////////////////////////-- CONST --////////////////////////////////////////////////////// 
const canvas = document.createElement("canvas");
document.querySelector("#app").appendChild(canvas);
canvas.style.width = "100%";
canvas.style.height = "100%";

const engine = new BABYLON.Engine(canvas, true);
engine.resize();

const scene = new BABYLON.Scene(engine);

// camera
const camera = new BABYLON.ArcRotateCamera(
  "cam",
  Math.PI / 2,
  Math.PI / 3,
  10,
  BABYLON.Vector3.Zero(),
  scene
);
camera.attachControl(canvas, true);

const fpsDiv = document.createElement("div");
fpsDiv.style.position = "absolute";
fpsDiv.style.top = "10px";
fpsDiv.style.left = "10px";
fpsDiv.style.color = "white";
fpsDiv.style.background = "black";
fpsDiv.style.padding = "5px";
document.body.appendChild(fpsDiv);

setInterval(() => {
    fpsDiv.innerText = "FPS: " + engine.getFps().toFixed(1);
}, 100);

//////////////////////////////////////////////////////--Functions --////////////////////////////////////////////////////// 
// Performance-FPS-Section
setInterval(() => {
    logData.push({
        time: performance.now(),
        fps: engine.getFps()
    });
}, 1000);

/*
  Downloads logged FPS data as a CSV file
*/
window.downloadLog = function () {
    const csv = [
        "time,fps",
        ...logData.map(d => `${d.time},${d.fps}`)
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "fps_log.csv";
    a.click();
};

//////////////////////////////////////////////////////-- Screen --////////////////////////////////////////////////////// 
// light
new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

SceneLoader.ImportMesh(
  "",
  "/models/",
  "DamagedHelmet.glb",
  scene,
  (meshes) => {
    scene.createDefaultCameraOrLight(true, true, true);
    scene.activeCamera.attachControl(canvas, true);
  }
);

//////////////////////////////////////////////////////-- Main --////////////////////////////////////////////////////// 

/*
  Main rendering-loop
*/
engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener("resize", () => {
    engine.resize();
});

