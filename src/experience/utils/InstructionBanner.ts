class InstructionBanner {
  constructor() {
    const message = document.createElement("div");
    message.id = "instruction-banner";
    message.innerHTML = `
      <p>Press 'F' or double-click to toggle fullscreen mode</p>
      <p>Press 'H' to hide/show the tweaks panel</p>
    `;
    message.style.opacity = "0";
    message.style.cssText = `
      z-index: 10;
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: 0.75rem;
      text-align: center;
      color: #fff;
      font-family: "SourceCodePro", system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
        sans-serif;
      font-size: 1rem;
      transition: opacity 1s ease-in-out;
    `;

    document.body.appendChild(message);

    setTimeout(() => {
      message.style.opacity = "1";
    }, 0);

    setTimeout(() => {
      message.style.opacity = "0";
      setTimeout(() => {
        message.remove();
      }, 1000);
    }, 6000);
  }
}
export default InstructionBanner;
