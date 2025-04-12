import Sea from "./sea/Sea";

class World {
  sea: Sea;

  constructor() {
    this.sea = new Sea();
  }

  update() {
    this.sea.update();
  }

  destroy() {
    this.sea.dispose();
  }
}

export default World;
