import { Point } from "../types";
import type { Drawable } from "../draw/Drawable.js";

export abstract class Figure implements Drawable {
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
}
