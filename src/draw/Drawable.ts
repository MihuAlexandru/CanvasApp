import { Point } from "../types";

export interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void;
  containsPoint?(p: Point): boolean;
  moveBy?(dx: number, dy: number): void;
  getBounds?(): { x: number; y: number; w: number; h: number };
}
