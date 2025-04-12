import * as THREE from "three";
import Canvas from "./Canvas";
import Sizes from "./utils/Sizes";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Timer from "./utils/Timer";
import World from "./world/World";
import Debug from "./utils/Debug";
import FullscreenHandler from "./utils/FullscreenHandler";
import InstructionBanner from "./utils/InstructionBanner";

class Experience {
  private static instance: Experience;
  debug!: Debug;
  canvas!: Canvas;
  fullscreenHandler!: FullscreenHandler;
  sizes!: Sizes;
  timer!: Timer;
  scene!: THREE.Scene;
  camera!: Camera;
  renderer!: Renderer;
  world!: World;

  constructor() {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;

    /* FOR DEBUG PURPOSES ↓ */
    // @ts-ignore
    window.experience = this;

    this.debug = new Debug();
    this.canvas = new Canvas();
    this.fullscreenHandler = new FullscreenHandler();
    this.sizes = new Sizes();
    this.timer = new Timer();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    new InstructionBanner();

    this.timer.on("tick", this.update);
    this.sizes.on("resize", this.resize);
  }

  update = () => {
    this.world.update();
    this.camera.update();
    this.renderer.update();
  };

  resize = () => {
    this.camera.resize();
    this.renderer.resize();
  };

  destroy() {
    this.debug.dispose();
    this.sizes.dispose();
    this.fullscreenHandler.dispose();
    this.camera.destroy();
    this.renderer.dispose();
    this.world.destroy();
    this.canvas.destroy();
  }

  static getInstance() {
    if (!Experience.instance) {
      throw new Error();
    }
    return Experience.instance;
  }
}

export default Experience;
