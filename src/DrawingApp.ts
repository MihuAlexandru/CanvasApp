import type { Stroke, Tool, Point } from "./types.js";

import { InfoUI } from "./ui/InfoUI.js";
import { Figure } from "./figures/Figure.js";
import { EllipseFigure } from "./figures/EllipseFigure.js";
import { RectFigure } from "./figures/RectFigure.js";
import { LineFigure } from "./figures/LineFigure.js";
import { CanvasRenderer } from "./canvas/CanvasRenderer.js";
import { CanvasInput } from "./canvas/CanvasInput.js";
import { BrushUI } from "./ui/BrushUI.js";
import { ToolUI } from "./ui/ToolUI.js";
import { ClearUI } from "./ui/ClearUI.js";

export class DrawingApp {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private strokes: Stroke[] = [];
  private currentStroke: Stroke | null = null;

  private tool: Tool = "brush";
  private figures: Figure[] = [];
  private currentFigure: Figure | null = null;

  private brushColor = "#000000";
  private brushWidth = 3;

  private renderer: CanvasRenderer;
  private input: CanvasInput;
  private infoUI: InfoUI;

  constructor() {
    const canvasEl = document.getElementById("canvas");
    if (!(canvasEl instanceof HTMLCanvasElement))
      throw new Error("Canvas element #canvas not found");

    const ctx = canvasEl.getContext("2d");
    if (!ctx) throw new Error("2D context not available");

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = this.brushColor;
    ctx.lineWidth = this.brushWidth;

    this.canvas = canvasEl;
    this.ctx = ctx;

    this.renderer = new CanvasRenderer(this.canvas, this.ctx);

    this.input = new CanvasInput(this.canvas, {
      onDown: (p) => this.onDown(p),
      onMove: (p) => this.onMove(p),
      onUp: () => this.onUp(),
    });

    new ToolUI(
      () => this.tool,
      (t) => (this.tool = t),
    ).init();

    new BrushUI(
      (c) => this.setBrushColor(c),
      (w) => this.setBrushWidth(w),
      () => this.brushWidth,
    ).init();

    new ClearUI(() => this.clearCanvas()).init();

    this.infoUI = new InfoUI("#legenda .uiInfo", this.canvas);
    this.redraw();
  }

  private setBrushColor(color: string) {
    this.brushColor = color;
    this.ctx.strokeStyle = color;
  }

  private setBrushWidth(width: number) {
    const w = Number.isFinite(width) ? Math.max(1, Math.min(50, width)) : 2;
    this.brushWidth = w;
    this.ctx.lineWidth = w;
  }

  private redraw() {
    this.renderer.render(this.strokes, this.figures, this.currentFigure);
  }

  private clearCanvas() {
    this.strokes = [];
    this.currentStroke = null;
    this.figures = [];
    this.currentFigure = null;
    this.redraw();
  }

  private onDown(p: Point) {
    if (this.tool === "brush") {
      this.currentStroke = {
        color: this.brushColor,
        width: this.brushWidth,
        points: [p],
      };
      this.strokes.push(this.currentStroke);
    } else {
      this.currentFigure = this.createFigure(this.tool, p, p);
    }
    this.redraw();
  }

  private onMove(p: Point) {
    if (this.tool === "brush") {
      if (!this.currentStroke) return;
      this.currentStroke.points.push(p);
    } else {
      if (!this.currentFigure) return;
      this.currentFigure.updateEnd(p);
    }
    this.redraw();
  }

  private onUp() {
    this.currentStroke = null;

    if (this.currentFigure) {
      this.figures.push(this.currentFigure);
      this.currentFigure = null;
    }
    this.redraw();
  }

  private createFigure(
    tool: Exclude<Tool, "brush">,
    start: Point,
    end: Point,
  ): Figure {
    switch (tool) {
      case "rect":
        return new RectFigure(this.brushColor, this.brushWidth, start, end);
      case "ellipse":
        return new EllipseFigure(this.brushColor, this.brushWidth, start, end);
      case "line":
        return new LineFigure(this.brushColor, this.brushWidth, start, end);
      default: {
        const _never: never = tool;
        throw new Error(`Unknown tool: ${_never}`);
      }
    }
  }
}
