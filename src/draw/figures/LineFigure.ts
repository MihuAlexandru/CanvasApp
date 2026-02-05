import { Point } from "../../types.js";
import { distancePointToSegment } from "../Helpers.js";
import { Figure } from "../Figure.js";

export class LineFigure extends Figure {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.stroke();
    ctx.restore();
  }
  containsPoint(p: Point): boolean {
    const dist = distancePointToSegment(p, this.start, this.end);
    return dist <= this.width + 3;
  }

  moveBy(dx: number, dy: number) {
    this.start.x += dx;
    this.start.y += dy;
    this.end.x += dx;
    this.end.y += dy;
  }
}
