// @ts-nocheck
import Experience from "../Experience";

class FullscreenHandler {
  private canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = Experience.getInstance().canvas.domElement;

    this.canvas.addEventListener("dblclick", this.doubleClickHandler);
    window.addEventListener("keydown", this.keydownHandler);
  }

  private doubleClickHandler = () => {
    this.toggleFullscreen();
  };

  private keydownHandler = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "f") this.toggleFullscreen();
  };

  dispose() {
    this.canvas.removeEventListener("dblclick", this.doubleClickHandler);
    window.removeEventListener("keydown", this.keydownHandler);
  }

  goFullscreen() {
    if (this.canvas.requestFullscreen) {
      this.canvas.requestFullscreen();
    } else if (this.canvas.webkitRequestFullscreen) {
      this.canvas.webkitRequestFullscreen();
    } else if (this.canvas.mozRequestFullscreen) {
      this.canvas.mozRequestFullscreen();
    } else if (this.canvas.msRequestFullscreen) {
      this.canvas.msRequestFullscreen();
    }
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozExitFullscreen) {
      document.mozExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  toggleFullscreen() {
    const hasFullscreen =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullscreenElement ||
      document.msFullscreenElement;

    if (hasFullscreen) {
      this.exitFullscreen();
    } else {
      this.goFullscreen();
    }
  }
}

export default FullscreenHandler;
