import Experience from "../Experience";
import Sea from "./sea/Sea";

class World {
  private readonly experience: Experience;
  sea?: Sea;

  constructor() {
    this.experience = Experience.getInstance();

    this.experience.resources.on("loaded", () => {
      this.sea = new Sea();
    });
  }

  update() {
    this.sea?.update();
  }

  destroy() {
    this.sea?.dispose();
  }
}

export default World;
