import { Bounds, Point } from "./types";

export interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface Selectable {
  containsPoint(p: Point): boolean;
}

export interface Bounded {
  getBounds(): Bounds;
}

export interface Movable {
  moveBy(dx: number, dy: number): void;
}
