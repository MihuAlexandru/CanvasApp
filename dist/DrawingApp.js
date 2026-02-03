import { InfoUI } from "./ui/InfoUI.js";
import { EllipseFigure } from "./draw/figures/EllipseFigure.js";
import { RectFigure } from "./draw/figures/RectFigure.js";
import { LineFigure } from "./draw/figures/LineFigure.js";
import { CanvasRenderer } from "./canvas/CanvasRenderer.js";
import { CanvasInput } from "./canvas/CanvasInput.js";
import { BrushUI } from "./ui/BrushUI.js";
import { ToolUI } from "./ui/ToolUI.js";
import { ClearUI } from "./ui/ClearUI.js";
import { Stroke } from "./draw/Stroke.js";
import { FillOperation } from "./draw/FillOperation.js";
function floodFillOperation(ctx, startX, startY, fillColor) {
    const { width, height } = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const getPixel = (x, y) => {
        const i = (y * width + x) * 4;
        return [data[i], data[i + 1], data[i + 2], data[i + 3]];
    };
    const setPixel = (x, y) => {
        const i = (y * width + x) * 4;
        data[i] = fillColor[0];
        data[i + 1] = fillColor[1];
        data[i + 2] = fillColor[2];
        data[i + 3] = fillColor[3];
    };
    const targetColor = getPixel(startX, startY);
    if (targetColor.toString() === fillColor.toString())
        return null;
    const queue = [{ x: startX, y: startY }];
    const visited = new Set();
    let minX = startX, maxX = startX;
    let minY = startY, maxY = startY;
    const key = (x, y) => `${x},${y}`;
    while (queue.length) {
        const { x, y } = queue.shift();
        const k = key(x, y);
        if (visited.has(k))
            continue;
        visited.add(k);
        const current = getPixel(x, y);
        if (current.toString() !== targetColor.toString())
            continue;
        setPixel(x, y);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        if (x > 0)
            queue.push({ x: x - 1, y });
        if (x < width - 1)
            queue.push({ x: x + 1, y });
        if (y > 0)
            queue.push({ x, y: y - 1 });
        if (y < height - 1)
            queue.push({ x, y: y + 1 });
    }
    const regionWidth = maxX - minX + 1;
    const regionHeight = maxY - minY + 1;
    const regionData = new ImageData(regionWidth, regionHeight);
    for (let y = 0; y < regionHeight; y++) {
        for (let x = 0; x < regionWidth; x++) {
            const srcIndex = ((minY + y) * width + (minX + x)) * 4;
            const dstIndex = (y * regionWidth + x) * 4;
            regionData.data[dstIndex] = data[srcIndex];
            regionData.data[dstIndex + 1] = data[srcIndex + 1];
            regionData.data[dstIndex + 2] = data[srcIndex + 2];
            regionData.data[dstIndex + 3] = data[srcIndex + 3];
        }
    }
    return new FillOperation(minX, minY, regionWidth, regionHeight, regionData);
}
export class DrawingApp {
    constructor() {
        this.tool = "brush";
        this.drawables = [];
        this.currentStroke = null;
        this.currentFigure = null;
        this.brushColor = "#000000";
        this.brushWidth = 3;
        const canvasEl = document.getElementById("canvas");
        if (!(canvasEl instanceof HTMLCanvasElement))
            throw new Error("Canvas element #canvas not found");
        const ctx = canvasEl.getContext("2d", { willReadFrequently: true });
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
        this.infoUI = new InfoUI("#legenda .ui-info", this.canvas);
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
        this.renderer.render(this.drawables);
    }
    clearCanvas() {
        this.drawables = [];
        this.currentStroke = null;
        this.currentFigure = null;
        this.redraw();
    }
    hexToRgba(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b, 255];
    }
    applyFill(p) {
        const rgba = this.hexToRgba(this.brushColor);
        const op = floodFillOperation(this.ctx, Math.floor(p.x), Math.floor(p.y), rgba);
        if (op) {
            this.drawables.push(op);
            this.redraw();
        }
    }
    onDown(p) {
        if (this.tool === "fill") {
            this.applyFill(p);
            return;
        }
        else if (this.tool === "brush" || this.tool === "eraser") {
            const mode = this.tool === "eraser" ? "erase" : "draw";
            const width = this.brushWidth;
            this.currentStroke = new Stroke(this.brushColor, width, mode);
            this.currentStroke.addPoint(p);
            this.drawables.push(this.currentStroke);
        }
        else {
            this.currentFigure = this.createFigure(this.tool, p, p);
            this.drawables.push(this.currentFigure);
        }
        this.redraw();
    }
    onMove(p) {
        if (this.tool === "brush" || this.tool === "eraser") {
            if (!this.currentStroke)
                return;
            this.currentStroke.addPoint(p);
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
        this.currentFigure = null;
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