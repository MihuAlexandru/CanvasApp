import { InfoUI } from "./InfoUI.js";
import { EllipseFigure } from "./figures/EllipseFigure.js";
import { RectFigure } from "./figures/RectFigure.js";
import { LineFigure } from "./figures/LineFigure.js";
class DrawingApp {
    constructor() {
        this.paint = false;
        this.strokes = [];
        this.currentStroke = null;
        this.brushColor = "#000000";
        this.brushWidth = 3;
        this.tool = "brush";
        this.figures = [];
        this.currentFigure = null;
        this.clearEventHandler = () => {
            this.clearCanvas();
        };
        this.pointerDown = (e) => {
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
            }
            else {
                this.currentFigure = this.createFigure(this.tool, p, p);
            }
            this.redraw();
        };
        this.pointerMove = (e) => {
            if (e.buttons === 0)
                return; // not pressed
            e.preventDefault();
            const p = this.getPointFromPointer(e);
            if (this.tool === "brush") {
                if (!this.paint || !this.currentStroke)
                    return;
                this.currentStroke.points.push(p);
            }
            else {
                if (!this.currentFigure)
                    return;
                this.currentFigure.updateEnd(p);
            }
            this.redraw();
        };
        this.pointerUp = (e) => {
            this.paint = false;
            this.currentStroke = null;
            if (this.currentFigure) {
                // finalize
                this.figures.push(this.currentFigure);
                this.currentFigure = null;
            }
            this.redraw();
        };
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
    createToolEvents() {
        var _a, _b, _c, _d;
        (_a = document
            .getElementById("toolBrush")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => (this.tool = "brush"));
        (_b = document
            .getElementById("toolRect")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => (this.tool = "rect"));
        (_c = document
            .getElementById("toolEllipse")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => (this.tool = "ellipse"));
        (_d = document
            .getElementById("toolLine")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => (this.tool = "line"));
    }
    createUserEvents() {
        var _a;
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
        (_a = document
            .getElementById("clear")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.clearEventHandler);
    }
    createColorPickerEvents() {
        const picker = document.getElementById("colorPicker");
        if (!(picker instanceof HTMLInputElement)) {
            console.warn("Color picker #colorPicker not found.");
            return;
        }
        const valueLabel = document.getElementById("colorValue");
        this.setBrushColor(picker.value);
        if (valueLabel)
            valueLabel.textContent = picker.value;
        picker.addEventListener("input", () => {
            this.setBrushColor(picker.value);
            if (valueLabel)
                valueLabel.textContent = picker.value;
        });
    }
    setBrushColor(color) {
        this.brushColor = color;
        this.context.strokeStyle = color;
    }
    redraw() {
        const ctx = this.context;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // 1) draw all strokes
        for (const stroke of this.strokes) {
            const pts = stroke.points;
            if (pts.length === 0)
                continue;
            ctx.save();
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.width;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
                const p = pts[i];
                if (!p)
                    continue;
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
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.strokes = [];
        this.currentStroke = null;
        this.figures = [];
        this.currentFigure = null;
        this.paint = false;
    }
    getPointFromPointer(e) {
        const rect = this.canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    createFigure(tool, start, end) {
        switch (tool) {
            case "rect":
                return new RectFigure(this.brushColor, this.brushWidth, start, end);
            case "ellipse":
                return new EllipseFigure(this.brushColor, this.brushWidth, start, end);
            case "line":
                return new LineFigure(this.brushColor, this.brushWidth, start, end);
        }
    }
    createBrushSizeEvents() {
        var _a;
        const sizeValue = document.getElementById("sizeValue");
        const radios = document.querySelectorAll('input[name="brushSize"]');
        if (!radios.length) {
            console.warn("No brush size radios found (name='brushSize').");
            return;
        }
        const checked = (_a = Array.from(radios).find((r) => r.checked)) !== null && _a !== void 0 ? _a : radios[0];
        if (checked) {
            this.setBrushWidth(Number(checked.value));
            if (sizeValue)
                sizeValue.textContent = `Size: ${this.brushWidth}px`;
        }
        radios.forEach((radio) => {
            radio.addEventListener("change", () => {
                if (!radio.checked)
                    return;
                this.setBrushWidth(Number(radio.value));
                if (sizeValue)
                    sizeValue.textContent = `Size: ${this.brushWidth}px`;
            });
        });
    }
    setBrushWidth(width) {
        const w = Number.isFinite(width) ? Math.max(1, Math.min(50, width)) : 2;
        this.brushWidth = w;
        this.context.lineWidth = w;
    }
}
new DrawingApp();
//# sourceMappingURL=index.js.map