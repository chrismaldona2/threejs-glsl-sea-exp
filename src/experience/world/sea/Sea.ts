import * as THREE from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import Experience from "../../Experience";
import GUI from "lil-gui";

type SeaVariant = "cold" | "warm" | "temperate";

interface VariantConfig {
  bgColor: `#${string}`;
  surfaceColor: `#${string}`;
  depthColor: `#${string}`;
  colorOffset: number;
  colorMultiplier: number;
}

class Sea {
  private readonly experience: Experience;
  private readonly sound: HTMLAudioElement;
  soundEnabled: boolean;
  private tweaks?: GUI;
  segmentsAmount: number;
  currentVariant: SeaVariant;
  surfaceColor: string;
  depthColor: string;
  geometry: THREE.PlaneGeometry;
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh;

  private readonly variants: Record<SeaVariant, VariantConfig> = {
    cold: {
      bgColor: "#89bcc8",
      surfaceColor: "#40809c",
      depthColor: "#0a3544",
      colorOffset: 0.2,
      colorMultiplier: 5.4,
    },
    warm: {
      bgColor: "#94ebff",
      surfaceColor: "#01c4d2",
      depthColor: "#2a7eb7",
      colorOffset: 0.183,
      colorMultiplier: 4.5,
    },
    temperate: {
      bgColor: "#b3dbf1",
      surfaceColor: "#4486b7",
      depthColor: "#07294f",
      colorOffset: 0.25,
      colorMultiplier: 4.5,
    },
  };

  constructor() {
    this.experience = Experience.getInstance();

    this.sound = new Audio("./sounds/waves.mp3");
    this.sound.volume = 0.01;
    this.sound.loop = true;
    this.soundEnabled = true;
    const playSoundOnInteraction = () => {
      this.sound.play();
      document.removeEventListener("click", playSoundOnInteraction);
    };
    document.addEventListener("click", playSoundOnInteraction);

    this.segmentsAmount = 256;
    this.currentVariant = "cold";
    this.experience.scene.background = new THREE.Color(
      this.variants[this.currentVariant].bgColor
    );
    this.surfaceColor = this.variants[this.currentVariant].surfaceColor;
    this.depthColor = this.variants[this.currentVariant].depthColor;

    this.geometry = new THREE.PlaneGeometry(
      10,
      10,
      this.segmentsAmount,
      this.segmentsAmount
    );
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uWavesElevation: { value: 0.1 },
        uWavesFrequency: { value: new THREE.Vector2(4, 1.1) },
        uWavesSpeed: { value: 0.75 },
        uChopWavesElevation: { value: 0.1 },
        uChopWavesFrequency: { value: 1.75 },
        uChopWavesSpeed: { value: 0.2 },
        uChopWavesIterations: { value: 4 },
        uSurfaceColor: { value: new THREE.Color(this.surfaceColor) },
        uDepthColor: { value: new THREE.Color(this.depthColor) },
        uColorOffset: { value: this.variants[this.currentVariant].colorOffset },
        uColorMultiplier: {
          value: this.variants[this.currentVariant].colorMultiplier,
        },
      },
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI / 2;

    this.experience.scene.add(this.mesh);

    this.setupTweaks();
  }

  update() {
    this.material.uniforms.uTime.value = this.experience.timer.elapsedTime;
  }

  setVariant(name: SeaVariant) {
    const variant = this.variants[name];
    if (!variant) return;

    this.currentVariant = name;
    this.experience.scene.background = new THREE.Color(variant.bgColor);
    this.surfaceColor = variant.surfaceColor;
    this.depthColor = variant.depthColor;

    this.material.uniforms.uSurfaceColor.value.set(this.surfaceColor);
    this.material.uniforms.uDepthColor.value.set(this.depthColor);
    this.material.uniforms.uColorOffset.value = variant.colorOffset;
    this.material.uniforms.uColorMultiplier.value = variant.colorMultiplier;
  }

  toggleSound() {
    if (this.soundEnabled) {
      this.sound.play();
    } else {
      this.sound.pause();
    }
  }

  setupTweaks() {
    this.experience.debug.instance
      .add(this, "currentVariant")
      .options(["cold", "warm", "temperate"])
      .onChange(() => {
        this.setVariant(this.currentVariant);
      })
      .name("CurrentVariant");

    this.tweaks = this.experience.debug.instance.addFolder("Sea");
    this.tweaks
      .add(this, "soundEnabled")
      .name("SoundEnabled")
      .onChange(() => {
        this.toggleSound();
      });

    this.tweaks
      .add(this, "segmentsAmount")
      .options([64, 128, 256, 512, 1024])
      .onChange(() => {
        this.mesh.geometry.dispose();
        this.geometry = new THREE.PlaneGeometry(
          10,
          10,
          this.segmentsAmount,
          this.segmentsAmount
        );
        this.mesh.geometry = this.geometry;
      })
      .name("SegmentsAmount");

    this.tweaks.add(this.material, "wireframe").name("Wireframe");
    this.tweaks
      .add(this.material.uniforms.uWavesSpeed, "value")
      .min(0)
      .max(3)
      .step(0.01)
      .name("WavesSpeed");

    this.tweaks
      .add(this.material.uniforms.uWavesElevation, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("WavesElevation");

    const wavesFrequencyTweak = this.tweaks.addFolder("WavesFrequency");
    wavesFrequencyTweak
      .add(this.material.uniforms.uWavesFrequency.value, "x")
      .min(0)
      .max(10)
      .step(0.01)
      .name("FrequencyX");
    wavesFrequencyTweak
      .add(this.material.uniforms.uWavesFrequency.value, "y")
      .min(0)
      .max(10)
      .step(0.01)
      .name("FrequencyZ");

    const colorTweak = this.tweaks.addFolder("Color");
    colorTweak
      .addColor(this, "surfaceColor")
      .name("SurfaceColor")
      .onChange(() => {
        this.material.uniforms.uSurfaceColor.value.set(this.surfaceColor);
      })
      .listen();
    colorTweak
      .addColor(this, "depthColor")
      .name("DepthColor")
      .onChange(() => {
        this.material.uniforms.uDepthColor.value.set(this.depthColor);
      })
      .listen();
    colorTweak
      .add(this.material.uniforms.uColorOffset, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("ColorOffset")
      .listen();
    colorTweak
      .add(this.material.uniforms.uColorMultiplier, "value")
      .min(0)
      .max(10)
      .step(0.001)
      .name("ColorMultiplier")
      .listen();

    const chopWavesTweak = this.tweaks.addFolder("ChopWaves");
    chopWavesTweak
      .add(this.material.uniforms.uChopWavesIterations, "value")
      .min(0)
      .max(5)
      .step(1)
      .name("ChopWavesIterations");
    chopWavesTweak
      .add(this.material.uniforms.uChopWavesSpeed, "value")
      .min(0)
      .max(4)
      .step(0.001)
      .name("ChopWavesSpeed");
    chopWavesTweak
      .add(this.material.uniforms.uChopWavesElevation, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("ChopWavesElevation");
    chopWavesTweak
      .add(this.material.uniforms.uChopWavesFrequency, "value")
      .min(0)
      .max(10)
      .step(0.01)
      .name("ChopWavesFrequency");
  }

  dispose() {
    if (this.tweaks) {
      this.tweaks.destroy();
    }
    this.geometry.dispose();
    this.material.dispose();
    this.experience.scene.remove(this.mesh);
  }
}

export default Sea;
