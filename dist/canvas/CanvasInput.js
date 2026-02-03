export class CanvasInput {
    constructor(canvas, handlers) {
        this.canvas = canvas;
        this.handlers = handlers;
        this.pointerDown = (e) => {
            e.preventDefault();
            this.canvas.setPointerCapture(e.pointerId);
            this.handlers.onDown(this.getPoint(e), e);
        };
        this.pointerMove = (e) => {
            if (e.buttons === 0)
                return;
            e.preventDefault();
            this.handlers.onMove(this.getPoint(e), e);
        };
        this.pointerUp = (e) => {
            this.handlers.onUp(e);
        };
        canvas.addEventListener("pointerdown", this.pointerDown, {
            passive: false,
        });
        canvas.addEventListener("pointermove", this.pointerMove, {
            passive: false,
        });
        canvas.addEventListener("pointerup", this.pointerUp);
        canvas.addEventListener("pointercancel", this.pointerUp);
        canvas.addEventListener("pointerleave", this.pointerUp);
    }
    destroy() {
        this.canvas.removeEventListener("pointerdown", this.pointerDown);
        this.canvas.removeEventListener("pointermove", this.pointerMove);
        this.canvas.removeEventListener("pointerup", this.pointerUp);
        this.canvas.removeEventListener("pointercancel", this.pointerUp);
        this.canvas.removeEventListener("pointerleave", this.pointerUp);
    }
    getPoint(e) {
        const rect = this.canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
}
//# sourceMappingURL=CanvasInput.js.map