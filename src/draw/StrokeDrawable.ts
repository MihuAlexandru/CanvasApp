import type { Point } from "../types.js";
import type { Drawable } from "./Drawable.js";

export type StrokeMode = "draw" | "erase";

export class StrokeDrawable implements Drawable {
  public points: Point[] = [];

  constructor(
    public color: string,
    public width: number,
    public mode: StrokeMode = "draw",
  ) {}

  addPoint(p: Point) {
    this.points.push(p);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.points.length === 0) return;

    ctx.save();
    ctx.lineWidth = this.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (this.mode === "erase") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = this.color;
    }

    ctx.beginPath();
    ctx.moveTo(this.points[0]!.x, this.points[0]!.y);
    for (let i = 1; i < this.points.length; i++) {
      const p = this.points[i]!;
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.restore();
  }
}
