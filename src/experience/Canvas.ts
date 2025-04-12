class Canvas {
  domElement: HTMLCanvasElement;
  constructor() {
    this.domElement = document.createElement("canvas");
    this.domElement.id = "webgl_canvas";
    this.domElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      user-select: none;
      outline: none;
    `;
    document.body.appendChild(this.domElement);
  }

  destroy() {
    this.domElement.remove();
  }
}
export default Canvas;
