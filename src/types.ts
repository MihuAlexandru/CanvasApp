export type Point = { x: number; y: number };

export type Tool = "brush" | "rect" | "ellipse" | "line" | "eraser";

export type StrokeMode = "draw" | "erase";

export type Handlers = {
  onDown(p: Point, e: PointerEvent): void;
  onMove(p: Point, e: PointerEvent): void;
  onUp(e: PointerEvent): void;
};
