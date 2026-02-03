import { Figure } from "../Figure.js";

export class EllipseFigure extends Figure {
  draw(ctx: CanvasRenderingContext2D) {
    const cx = (this.start.x + this.end.x) / 2;
    const cy = (this.start.y + this.end.y) / 2;
    const rx = Math.abs(this.end.x - this.start.x) / 2;
    const ry = Math.abs(this.end.y - this.start.y) / 2;

    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}
