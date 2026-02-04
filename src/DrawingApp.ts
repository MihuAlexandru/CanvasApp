import type { Tool, Point } from "./types.js";

import { InfoUI } from "./ui/InfoUI.js";
import { Figure } from "./draw/Figure.js";
import { EllipseFigure } from "./draw/figures/EllipseFigure.js";
import { RectFigure } from "./draw/figures/RectFigure.js";
import { LineFigure } from "./draw/figures/LineFigure.js";
import { CanvasRenderer } from "./canvas/CanvasRenderer.js";
import { CanvasInput } from "./canvas/CanvasInput.js";
import { BrushUI } from "./ui/BrushUI.js";
import { ToolUI } from "./ui/ToolUI.js";
import { ClearUI } from "./ui/ClearUI.js";

import type { Drawable } from "./draw/Drawable.js";
import { Stroke } from "./draw/Stroke.js";
import { FillOperation } from "./draw/FillOperation.js";

export class DrawingApp {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private tool: Tool = "brush";
  private drawables: Drawable[] = [];
  private currentStroke: Stroke | null = null;
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

    const ctx = canvasEl.getContext("2d", { willReadFrequently: true });
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

    this.infoUI = new InfoUI("#legenda .ui-info", this.canvas);
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
    this.renderer.render(this.drawables);
  }

  private clearCanvas() {
    this.drawables = [];
    this.currentStroke = null;
    this.currentFigure = null;
    this.redraw();
  }
  private hexToRgba(hex: string): [number, number, number, number] {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b, 255];
  }

  private applyFill(p: Point) {
    const rgba = this.hexToRgba(this.brushColor);
    const op = FillOperation.run(
      this.ctx,
      Math.floor(p.x),
      Math.floor(p.y),
      rgba,
    );

    if (op) {
      this.drawables.push(op);
      this.redraw();
    }
  }

  private onDown(p: Point) {
    if (this.tool === "fill") {
      this.applyFill(p);
      return;
    } else if (this.tool === "brush" || this.tool === "eraser") {
      const mode = this.tool === "eraser" ? "erase" : "draw";
      const width = this.brushWidth;

      this.currentStroke = new Stroke(this.brushColor, width, mode);
      this.currentStroke.addPoint(p);
      this.drawables.push(this.currentStroke);
    } else {
      this.currentFigure = this.createFigure(this.tool, p, p);
      this.drawables.push(this.currentFigure);
    }

    this.redraw();
  }

  private onMove(p: Point) {
    if (this.tool === "brush" || this.tool === "eraser") {
      if (!this.currentStroke) return;
      this.currentStroke.addPoint(p);
    } else {
      if (!this.currentFigure) return;
      this.currentFigure.updateEnd(p);
    }
    this.redraw();
  }

  private onUp() {
    this.currentStroke = null;
    this.currentFigure = null;
    this.redraw();
  }

  private createFigure(
    tool: Exclude<Tool, "brush" | "eraser" | "fill">,
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
