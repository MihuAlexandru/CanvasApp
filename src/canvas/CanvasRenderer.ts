import type { Stroke } from "../types.js";
import type { Figure } from "../figures/Figure.js";

export class CanvasRenderer {
  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
  ) {}

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render(strokes: Stroke[], figures: Figure[], previewFigure: Figure | null) {
    const ctx = this.ctx;
    this.clear();

    for (const stroke of strokes) {
      const pts = stroke.points;
      if (pts.length === 0) continue;

      ctx.save();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(pts[0]!.x, pts[0]!.y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i]!.x, pts[i]!.y);
      ctx.stroke();
      ctx.restore();
    }

    for (const fig of figures) fig.draw(ctx);

    if (previewFigure) previewFigure.draw(ctx);
  }
}
