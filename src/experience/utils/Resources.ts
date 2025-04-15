import * as THREE from "three";
import sources, { Source } from "../data/sources";
import EventEmitter from "./EventEmitter";
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

type SupportedLoaders = GLTFLoader | THREE.TextureLoader;
type SupportedFiles = GLTF | THREE.Texture;

class Resources extends EventEmitter {
  private sources: Source[];
  private toLoad: number;
  private loaded: number;
  private items: Record<Source["name"], SupportedFiles>;
  private loaders: Record<Source["type"], SupportedLoaders>;

  constructor() {
    super();
    this.sources = sources;
    this.loaded = 0;
    this.toLoad = sources.length;
    this.loaders = this.initializeLoaders();
    this.items = {};

    this.startLoading();
  }

  private initializeLoaders(): typeof this.loaders {
    const gltfLoader = new GLTFLoader();
    const textureLoader = new THREE.TextureLoader();
    return { gltf: gltfLoader, texture: textureLoader };
  }

  private startLoading() {
    this.sources.forEach(({ name, type, path }) => {
      this.loaders[type].load(
        path,
        (file) => {
          this.items[name] = file;
          this.fileLoaded();
        },
        undefined,
        (error) => {
          console.error(`Error loading ${name}:`, error);
          this.fileLoaded();
        }
      );
    });
  }

  private fileLoaded() {
    this.loaded++;
    if (this.toLoad === this.loaded) {
      this.trigger("loaded");
    }
  }

  getAsset<T extends SupportedFiles>(name: string): T | undefined {
    return this.items[name] as T;
  }

  dispose() {
    this.off("loaded");
  }
}

export default Resources;
