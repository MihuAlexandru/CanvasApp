export class CanvasRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    render(strokes, figures, previewFigure) {
        const ctx = this.ctx;
        this.clear();
        // strokes
        for (const stroke of strokes) {
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
            for (let i = 1; i < pts.length; i++)
                ctx.lineTo(pts[i].x, pts[i].y);
            ctx.stroke();
            ctx.restore();
        }
        for (const fig of figures)
            fig.draw(ctx);
        if (previewFigure)
            previewFigure.draw(ctx);
    }
}
//# sourceMappingURL=CanvasRenderer.js.map