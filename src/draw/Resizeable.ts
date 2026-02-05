import { Point } from "../types";

export interface Resizable {
  start: Point;
  end: Point;
  updateEnd(p: Point): void;
}
