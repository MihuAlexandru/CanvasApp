export class InfoUI {
  private target: HTMLElement;
  private canvas: HTMLCanvasElement;

  private mouse = {
    clientX: 0,
    clientY: 0,
    canvasX: 0,
    canvasY: 0,
    insideCanvas: false,
  };

  private onScroll = () => this.render();
  private onResize = () => this.render();
  private onPointerMove = (e: PointerEvent) => this.handlePointerMove(e);

  constructor(targetSelector: string, canvas: HTMLCanvasElement) {
    const el = document.querySelector(targetSelector);
    if (!(el instanceof HTMLElement)) {
      throw new Error(`InfoUI: target '${targetSelector}' not found`);
    }

    this.target = el;
    this.canvas = canvas;

    this.target.style.whiteSpace = "pre";
    this.target.style.fontFamily = "monospace";
    this.target.style.fontSize = "12px";

    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onResize, { passive: true });

    window.addEventListener("pointermove", this.onPointerMove, {
      passive: true,
    });

    this.render();
  }

  public destroy() {
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("pointermove", this.onPointerMove);
  }

  private handlePointerMove(e: PointerEvent) {
    this.mouse.clientX = e.clientX;
    this.mouse.clientY = e.clientY;

    const rect = this.canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    this.mouse.canvasX = canvasX;
    this.mouse.canvasY = canvasY;
    this.mouse.insideCanvas =
      canvasX >= 0 &&
      canvasY >= 0 &&
      canvasX <= rect.width &&
      canvasY <= rect.height;

    this.render();
  }

  private render() {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const doc = document.documentElement;
    const docW = doc.scrollWidth;
    const docH = doc.scrollHeight;

    const lines = [
      "Screen: ",
      `ScrollX / ScrollY: ${Math.round(scrollX)} / ${Math.round(scrollY)}`,
      `Viewport Size: ${vw} x ${vh}`,
      `Document Size: ${docW} x ${docH}`,
      `ClientX / ClientY: ${Math.round(this.mouse.clientX)} / ${Math.round(this.mouse.clientY)}`,

      "",
      "Canvas: ",
      `Size: ${this.canvas.width} x ${this.canvas.height}`,
      `CanvasX / CanvasY: ${Math.round(this.mouse.canvasX)} / ${Math.round(this.mouse.canvasY)}`,
      `Inside canvas: ${this.mouse.insideCanvas}`,
    ];

    this.target.textContent = lines.join("\n");
  }
}
