import type { Point, StrokeMode } from "../types.js";
import { distancePointToSegment } from "./Helpers.js";
import type { Drawable } from "./Drawable.js";

export class Stroke implements Drawable {
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
  containsPoint(p: Point): boolean {
    for (let i = 1; i < this.points.length; i++) {
      const a = this.points[i - 1]!;
      const b = this.points[i]!;
      if (distancePointToSegment(p, a, b) <= this.width + 3) {
        return true;
      }
    }
    return false;
  }

  moveBy(dx: number, dy: number) {
    for (const pt of this.points) {
      pt.x += dx;
      pt.y += dy;
    }
  }
  resizeByHandle(handle: number, p: Point) {
    const b = this.getBounds();
    const oldX = b.x;
    const oldY = b.y;
    const oldW = b.w;
    const oldH = b.h;

    let newX = oldX;
    let newY = oldY;
    let newW = oldW;
    let newH = oldH;

    switch (handle) {
      case 0:
        newX = p.x;
        newY = p.y;
        newW = oldW + (oldX - p.x);
        newH = oldH + (oldY - p.y);
        break;

      case 1:
        newY = p.y;
        newW = p.x - oldX;
        newH = oldH + (oldY - p.y);
        break;

      case 2:
        newX = p.x;
        newW = oldW + (oldX - p.x);
        newH = p.y - oldY;
        break;

      case 3:
        newW = p.x - oldX;
        newH = p.y - oldY;
        break;
    }

    const scaleX = newW / oldW;
    const scaleY = newH / oldH;

    this.points = this.points.map((pt) => ({
      x: newX + (pt.x - oldX) * scaleX,
      y: newY + (pt.y - oldY) * scaleY,
    }));
  }

  getBounds() {
    const xs = this.points.map((p) => p.x);
    const ys = this.points.map((p) => p.y);
    const x = Math.min(...xs);
    const y = Math.min(...ys);
    const w = Math.max(...xs) - x;
    const h = Math.max(...ys) - y;
    return { x, y, w, h };
  }
}
