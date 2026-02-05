import { Figure } from "../Figure.js";
export class EllipseFigure extends Figure {
    draw(ctx) {
        const cx = (this.start.x + this.end.x) / 2;
        const cy = (this.start.y + this.end.y) / 2;
        const rx = Math.abs(this.end.x - this.start.x) / 2;
        const ry = Math.abs(this.end.y - this.start.y) / 2;
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
    containsPoint(p) {
        const cx = (this.start.x + this.end.x) / 2;
        const cy = (this.start.y + this.end.y) / 2;
        const rx = Math.abs(this.end.x - this.start.x) / 2;
        const ry = Math.abs(this.end.y - this.start.y) / 2;
        const dx = (p.x - cx) ** 2 / rx ** 2;
        const dy = (p.y - cy) ** 2 / ry ** 2;
        return dx + dy <= 1;
    }
    moveBy(dx, dy) {
        this.start.x += dx;
        this.start.y += dy;
        this.end.x += dx;
        this.end.y += dy;
    }
}
//# sourceMappingURL=EllipseFigure.js.map