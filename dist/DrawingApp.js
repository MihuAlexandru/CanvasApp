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
import { Stroke } from "./draw/Stroke.js";
import { FillOperation } from "./draw/FillOperation.js";
import { getHandleAtPoint } from "./draw/Helpers.js";
export class DrawingApp {
    constructor() {
        this.tool = "brush";
        this.drawables = [];
        this.currentStroke = null;
        this.currentFigure = null;
        this.brushColor = "#000000";
        this.brushWidth = 3;
        this.activeHandle = null;
        this.selected = null;
        this.dragOffset = null;
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
        var _a;
        this.renderer.render(this.drawables, (_a = this.selected) !== null && _a !== void 0 ? _a : undefined);
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
    isPointInsideBounds(p, b) {
        return p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h;
    }
    applyFill(p) {
        const rgba = this.hexToRgba(this.brushColor);
        const op = FillOperation.run(this.ctx, Math.floor(p.x), Math.floor(p.y), rgba);
        if (op) {
            this.drawables.push(op);
            this.redraw();
        }
    }
    onDown(p) {
        var _a, _b;
        if (this.tool === "select") {
            if ((_a = this.selected) === null || _a === void 0 ? void 0 : _a.getBounds) {
                const bounds = this.selected.getBounds();
                // 1. Check resize handles
                const handle = getHandleAtPoint(p, bounds);
                if (handle !== null) {
                    this.activeHandle = handle;
                    return;
                }
                // 2. Click inside bounding box → keep selection
                if (this.isPointInsideBounds(p, bounds)) {
                    this.dragOffset = p;
                    return;
                }
            }
            // 3. Try selecting a new object
            for (let i = this.drawables.length - 1; i >= 0; i--) {
                const item = this.drawables[i];
                if ((_b = item === null || item === void 0 ? void 0 : item.containsPoint) === null || _b === void 0 ? void 0 : _b.call(item, p)) {
                    this.selected = item;
                    this.dragOffset = p;
                    this.redraw();
                    return;
                }
            }
            // 4. Clicked outside everything → deselect
            this.selected = null;
            this.activeHandle = null;
            this.dragOffset = null;
            this.redraw();
            return;
        }
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
        else if (this.tool === "rect" ||
            this.tool === "ellipse" ||
            this.tool === "line") {
            this.currentFigure = this.createFigure(this.tool, p, p);
            this.drawables.push(this.currentFigure);
        }
        this.redraw();
    }
    onMove(p) {
        var _a, _b;
        if (this.tool === "select" && this.selected && this.activeHandle !== null) {
            this.resizeSelected(p);
            this.redraw();
            return;
        }
        if (this.tool === "select" &&
            this.selected &&
            this.dragOffset &&
            this.activeHandle === null) {
            const dx = p.x - this.dragOffset.x;
            const dy = p.y - this.dragOffset.y;
            (_b = (_a = this.selected).moveBy) === null || _b === void 0 ? void 0 : _b.call(_a, dx, dy);
            this.dragOffset = p;
            this.redraw();
            return;
        }
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
        this.activeHandle = null;
        this.dragOffset = null;
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
    isFigure(obj) {
        return obj instanceof Figure;
    }
    resizeSelected(p) {
        const sel = this.selected;
        if (!sel)
            return;
        if (sel instanceof Stroke) {
            sel.resizeByHandle(this.activeHandle, p);
            return;
        }
        if (this.isFigure(sel)) {
            switch (this.activeHandle) {
                case 0:
                    sel.start = p;
                    break;
                case 1:
                    sel.start.y = p.y;
                    sel.end.x = p.x;
                    break;
                case 2:
                    sel.start.x = p.x;
                    sel.end.y = p.y;
                    break;
                case 3:
                    sel.end = p;
                    break;
            }
        }
    }
}
//# sourceMappingURL=DrawingApp.js.map