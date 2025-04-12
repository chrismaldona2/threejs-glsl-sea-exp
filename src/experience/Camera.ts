import * as THREE from "three";
import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/Addons.js";

class Camera {
  private readonly experience: Experience;
  instance: THREE.PerspectiveCamera;
  controls: OrbitControls;
  constructor() {
    this.experience = Experience.getInstance();

    /* PERSPECTIVE CAMERA */
    this.instance = new THREE.PerspectiveCamera(
      45,
      this.experience.sizes.width / this.experience.sizes.height,
      0.1,
      100
    );
    this.instance.position.set(0.25, 2, 3);
    this.experience.scene.add(this.instance);

    /* ORBIT CONTROLS */
    this.controls = new OrbitControls(
      this.instance,
      this.experience.canvas.domElement
    );
    this.controls.enableDamping = true;
    this.controls.minDistance = 0.8;
    this.controls.maxDistance = 4;
    this.controls.maxTargetRadius = 0.5;
    this.controls.maxPolarAngle = Math.PI / 2.15;
  }

  update() {
    this.controls.update();
  }

  resize() {
    this.instance.aspect =
      this.experience.sizes.width / this.experience.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  destroy() {
    this.controls.dispose();
    this.experience.scene.remove(this.instance);
  }
}

export default Camera;
