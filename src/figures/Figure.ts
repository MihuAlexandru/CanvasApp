import { Point } from "../types";

export abstract class Figure {
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
