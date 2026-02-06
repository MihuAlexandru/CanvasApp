import type {
  Bounded,
  Drawable,
  Movable,
  Selectable,
} from "../utils/Interfaces.js";
import { Point } from "../utils/types.js";

export abstract class Figure
  implements Drawable, Selectable, Resizable, Bounded, Movable
{
  constructor(
    public color: string,
    public width: number,
    public start: Point,
    public end: Point,
  ) {}

  updateEnd(p: Point) {
    this.end = p;
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract containsPoint(p: Point): boolean;
  abstract moveBy(dx: number, dy: number): void;
  getBounds() {
    const x = Math.min(this.start.x, this.end.x);
    const y = Math.min(this.start.y, this.end.y);
    const w = Math.abs(this.end.x - this.start.x);
    const h = Math.abs(this.end.y - this.start.y);
    return { x, y, w, h };
  }
}

export interface Resizable {
  start: Point;
  end: Point;
  updateEnd(p: Point): void;
}
