import { InfoUI } from "./ui/InfoUI.js";
import { EllipseFigure } from "./figures/EllipseFigure.js";
import { RectFigure } from "./figures/RectFigure.js";
import { LineFigure } from "./figures/LineFigure.js";
import { CanvasRenderer } from "./canvas/CanvasRenderer.js";
import { CanvasInput } from "./canvas/CanvasInput.js";
import { BrushUI } from "./ui/BrushUI.js";
import { ToolUI } from "./ui/ToolUI.js";
import { ClearUI } from "./ui/ClearUI.js";
export class DrawingApp {
    constructor() {
        this.strokes = [];
        this.currentStroke = null;
        this.tool = "brush";
        this.figures = [];
        this.currentFigure = null;
        this.brushColor = "#000000";
        this.brushWidth = 3;
        const canvasEl = document.getElementById("canvas");
        if (!(canvasEl instanceof HTMLCanvasElement))
            throw new Error("Canvas element #canvas not found");
        const ctx = canvasEl.getContext("2d");
        if (!ctx)
            throw new Error("2D context not available");
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
        new ToolUI(() => this.tool, (t) => (this.tool = t)).init();
        new BrushUI((c) => this.setBrushColor(c), (w) => this.setBrushWidth(w), () => this.brushWidth).init();
        new ClearUI(() => this.clearCanvas()).init();
        this.infoUI = new InfoUI("#legenda .uiInfo", this.canvas);
        this.redraw();
    }
    setBrushColor(color) {
        this.brushColor = color;
        this.ctx.strokeStyle = color;
    }
    setBrushWidth(width) {
        const w = Number.isFinite(width) ? Math.max(1, Math.min(50, width)) : 2;
        this.brushWidth = w;
        this.ctx.lineWidth = w;
    }
    redraw() {
        this.renderer.render(this.strokes, this.figures, this.currentFigure);
    }
    clearCanvas() {
        this.strokes = [];
        this.currentStroke = null;
        this.figures = [];
        this.currentFigure = null;
        this.redraw();
    }
    onDown(p) {
        if (this.tool === "brush") {
            this.currentStroke = {
                color: this.brushColor,
                width: this.brushWidth,
                points: [p],
            };
            this.strokes.push(this.currentStroke);
        }
        else {
            this.currentFigure = this.createFigure(this.tool, p, p);
        }
        this.redraw();
    }
    onMove(p) {
        if (this.tool === "brush") {
            if (!this.currentStroke)
                return;
            this.currentStroke.points.push(p);
        }
        else {
            if (!this.currentFigure)
                return;
            this.currentFigure.updateEnd(p);
        }
        this.redraw();
    }
    onUp() {
        this.currentStroke = null;
        if (this.currentFigure) {
            this.figures.push(this.currentFigure);
            this.currentFigure = null;
        }
        this.redraw();
    }
    createFigure(tool, start, end) {
        switch (tool) {
            case "rect":
                return new RectFigure(this.brushColor, this.brushWidth, start, end);
            case "ellipse":
                return new EllipseFigure(this.brushColor, this.brushWidth, start, end);
            case "line":
                return new LineFigure(this.brushColor, this.brushWidth, start, end);
            default: {
                const _never = tool;
                throw new Error(`Unknown tool: ${_never}`);
            }
        }
    }
}
//# sourceMappingURL=DrawingApp.js.map