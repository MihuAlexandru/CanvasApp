export type Point = { x: number; y: number };

export type Tool = "brush" | "rect" | "ellipse" | "line";

export type Stroke = {
  color: string;
  width: number;
  points: Point[];
};
