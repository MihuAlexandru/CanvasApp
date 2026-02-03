import type { Drawable } from "../draw/Drawable.js";

export class CanvasRenderer {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
  ) {}

  render(items: Drawable[]) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const item of items) item.draw(this.ctx);
  }
}
