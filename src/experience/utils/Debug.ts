import GUI from "lil-gui";

class Debug {
  private keydownHandler: (e: KeyboardEvent) => void;
  instance: GUI;

  constructor() {
    this.instance = new GUI({ title: "Tweaks" });

    this.keydownHandler = (e) => {
      if (e.key.toLowerCase() === "h") {
        this.toggle();
      }
    };

    window.addEventListener("keydown", this.keydownHandler);
  }

  toggle() {
    this.instance.show(this.instance._hidden);
  }

  dispose() {
    window.removeEventListener("keydown", this.keydownHandler);
    this.instance.destroy();
  }
}

export default Debug;
