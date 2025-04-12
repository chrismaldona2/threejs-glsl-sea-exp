import * as THREE from "three";
import Experience from "./Experience";

class Renderer {
  private readonly experience: Experience;
  instance: THREE.WebGLRenderer;
  constructor() {
    this.experience = Experience.getInstance();

    this.instance = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.experience.canvas.domElement,
    });

    this.resize();
    this.update();
  }

  update() {
    this.instance.render(
      this.experience.scene,
      this.experience.camera.instance
    );
  }

  resize() {
    this.instance.setSize(
      this.experience.sizes.width,
      this.experience.sizes.height
    );
    this.instance.setPixelRatio(this.experience.sizes.pixelRatio);
  }

  dispose() {
    this.instance.dispose();
  }
}

export default Renderer;
