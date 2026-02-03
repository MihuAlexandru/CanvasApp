import type { Drawable } from "./Drawable.js";

export class FillOperation implements Drawable {
  constructor(
    private x: number,
    private y: number,
    private width: number,
    private height: number,
    private imageData: ImageData,
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.putImageData(this.imageData, this.x, this.y);
  }
}
