export class StrokeDrawable {
    constructor(color, width, mode = "draw") {
        this.color = color;
        this.width = width;
        this.mode = mode;
        this.points = [];
    }
    addPoint(p) {
        this.points.push(p);
    }
    draw(ctx) {
        if (this.points.length === 0)
            return;
        ctx.save();
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        if (this.mode === "erase") {
            // Erase pixels already drawn (including shapes) as long as those pixels were drawn BEFORE this stroke in history.
            ctx.globalCompositeOperation = "destination-out";
            ctx.strokeStyle = "rgba(0,0,0,1)"; // color irrelevant in destination-out
        }
        else {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = this.color;
        }
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            const p = this.points[i];
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
        ctx.restore();
    }
}
//# sourceMappingURL=StrokeDrawable.js.map