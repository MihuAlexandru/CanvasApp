import type { Stroke, Tool, Point } from "./types.js";

import { InfoUI } from "./InfoUI.js";
import { Figure } from "./figures/Figure.js";
import { EllipseFigure } from "./figures/EllipseFigure.js";
import { RectFigure } from "./figures/RectFigure.js";
import { LineFigure } from "./figures/LineFigure.js";

class DrawingApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private paint = false;

  private strokes: Stroke[] = [];
  private currentStroke: Stroke | null = null;

  private brushColor = "#000000";
  private brushWidth = 3;

  private tool: Tool = "brush";
  private figures: Figure[] = [];
  private currentFigure: Figure | null = null;

  private infoUI: InfoUI;

  constructor() {
    const canvasEl = document.getElementById("canvas");
    if (!(canvasEl instanceof HTMLCanvasElement)) {
      throw new Error("Canvas element with id='canvas' not found.");
    }

    const ctx = canvasEl.getContext("2d");
    if (!ctx) {
      throw new Error("2D rendering context not available.");
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = this.brushColor;
    ctx.lineWidth = this.brushWidth;

    this.canvas = canvasEl;
    this.context = ctx;

    this.createUserEvents();
    this.createToolEvents();
    this.createColorPickerEvents();
    this.createBrushSizeEvents();
    this.redraw();
    this.infoUI = new InfoUI("#legenda .uiInfo", this.canvas);
  }

  private createToolEvents() {
    document
      .getElementById("toolBrush")
      ?.addEventListener("click", () => (this.tool = "brush"));
    document
      .getElementById("toolRect")
      ?.addEventListener("click", () => (this.tool = "rect"));
    document
      .getElementById("toolEllipse")
      ?.addEventListener("click", () => (this.tool = "ellipse"));
    document
      .getElementById("toolLine")
      ?.addEventListener("click", () => (this.tool = "line"));
  }

  private createUserEvents() {
    const canvas = this.canvas;

    canvas.addEventListener("pointerdown", this.pointerDown, {
      passive: false,
    });
    canvas.addEventListener("pointermove", this.pointerMove, {
      passive: false,
    });
    canvas.addEventListener("pointerup", this.pointerUp);
    canvas.addEventListener("pointercancel", this.pointerUp);
    canvas.addEventListener("pointerleave", this.pointerUp);

    document
      .getElementById("clear")
      ?.addEventListener("click", this.clearEventHandler);
  }

  private createColorPickerEvents() {
    const picker = document.getElementById("colorPicker");
    if (!(picker instanceof HTMLInputElement)) {
      console.warn("Color picker #colorPicker not found.");
      return;
    }

    const valueLabel = document.getElementById("colorValue");

    this.setBrushColor(picker.value);
    if (valueLabel) valueLabel.textContent = picker.value;

    picker.addEventListener("input", () => {
      this.setBrushColor(picker.value);
      if (valueLabel) valueLabel.textContent = picker.value;
    });
  }

  private setBrushColor(color: string) {
    this.brushColor = color;
    this.context.strokeStyle = color;
  }

  private redraw() {
    const ctx = this.context;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1) draw all strokes
    for (const stroke of this.strokes) {
      const pts = stroke.points;
      if (pts.length === 0) continue;

      ctx.save();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(pts[0]!.x, pts[0]!.y);

      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        if (!p) continue;
        ctx.lineTo(p.x, p.y);
      }

      ctx.stroke();
      ctx.restore();
    }

    // 2) draw finalized figures
    for (const fig of this.figures) {
      fig.draw(ctx);
    }

    // 3) draw current preview (during drag)
    if (this.currentFigure) {
      this.currentFigure.draw(ctx);
    }
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.strokes = [];
    this.currentStroke = null;

    this.figures = [];
    this.currentFigure = null;

    this.paint = false;
  }

  private clearEventHandler = () => {
    this.clearCanvas();
  };

  private getPointFromPointer(e: PointerEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private pointerDown = (e: PointerEvent) => {
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);

    const p = this.getPointFromPointer(e);

    if (this.tool === "brush") {
      this.paint = true;
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
  };

  private pointerMove = (e: PointerEvent) => {
    if (e.buttons === 0) return; // not pressed
    e.preventDefault();

    const p = this.getPointFromPointer(e);

    if (this.tool === "brush") {
      if (!this.paint || !this.currentStroke) return;
      this.currentStroke.points.push(p);
    } else {
      if (!this.currentFigure) return;
      this.currentFigure.updateEnd(p);
    }

    this.redraw();
  };

  private pointerUp = (e: PointerEvent) => {
    this.paint = false;
    this.currentStroke = null;

    if (this.currentFigure) {
      // finalize
      this.figures.push(this.currentFigure);
      this.currentFigure = null;
    }

    this.redraw();
  };

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
    }
  }

  private createBrushSizeEvents() {
    const sizeValue = document.getElementById("sizeValue");

    const radios = document.querySelectorAll<HTMLInputElement>(
      'input[name="brushSize"]',
    );

    if (!radios.length) {
      console.warn("No brush size radios found (name='brushSize').");
      return;
    }

    const checked = Array.from(radios).find((r) => r.checked) ?? radios[0];
    if (checked) {
      this.setBrushWidth(Number(checked.value));
      if (sizeValue) sizeValue.textContent = `Size: ${this.brushWidth}px`;
    }

    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (!radio.checked) return;
        this.setBrushWidth(Number(radio.value));
        if (sizeValue) sizeValue.textContent = `Size: ${this.brushWidth}px`;
      });
    });
  }
  private setBrushWidth(width: number) {
    const w = Number.isFinite(width) ? Math.max(1, Math.min(50, width)) : 2;
    this.brushWidth = w;
    this.context.lineWidth = w;
  }
}

new DrawingApp();
