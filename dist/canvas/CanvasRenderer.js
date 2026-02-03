export class CanvasRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }
    render(items) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const item of items)
            item.draw(this.ctx);
    }
}
//# sourceMappingURL=CanvasRenderer.js.map