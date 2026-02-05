import type { Drawable } from "../draw/Drawable.js";

export class CanvasRenderer {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
  ) {}

  private drawResizeHandles(b: { x: number; y: number; w: number; h: number }) {
    const size = 8;
    const half = size / 2;

    const points = [
      { x: b.x, y: b.y },
      { x: b.x + b.w, y: b.y },
      { x: b.x, y: b.y + b.h },
      { x: b.x + b.w, y: b.y + b.h },
    ];

    this.ctx.save();
    this.ctx.fillStyle = "#00aaff";
    for (const p of points) {
      this.ctx.fillRect(p.x - half, p.y - half, size, size);
    }
    this.ctx.restore();
  }

  private drawBoundingBox(bounds: {
    x: number;
    y: number;
    w: number;
    h: number;
  }) {
    this.ctx.save();
    this.ctx.strokeStyle = "#00aaff";
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
    this.ctx.restore();

    this.drawResizeHandles(bounds);
  }

  render(items: Drawable[], selected?: Drawable) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const item of items) {
      item.draw(this.ctx);
    }
    if (selected && selected.getBounds) {
      this.drawBoundingBox(selected.getBounds());
    }
  }
}
