import { Bounded, Drawable, Movable, Selectable } from "./Interfaces";

export type Point = { x: number; y: number };

export type Tool =
  | "brush"
  | "rect"
  | "ellipse"
  | "line"
  | "eraser"
  | "fill"
  | "select";

export type StrokeMode = "draw" | "erase";

export type Handlers = {
  onDown(p: Point, e: PointerEvent): void;
  onMove(p: Point, e: PointerEvent): void;
  onUp(e: PointerEvent): void;
};

export type Bounds = { x: number; y: number; w: number; h: number };

export type SceneItem = Drawable & Partial<Selectable & Movable & Bounded>;
