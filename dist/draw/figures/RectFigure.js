import { Figure } from "../Figure.js";
export class RectFigure extends Figure {
    draw(ctx) {
        const x = Math.min(this.start.x, this.end.x);
        const y = Math.min(this.start.y, this.end.y);
        const w = Math.abs(this.end.x - this.start.x);
        const h = Math.abs(this.end.y - this.start.y);
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.stroke();
        ctx.restore();
    }
    containsPoint(p) {
        const x = Math.min(this.start.x, this.end.x);
        const y = Math.min(this.start.y, this.end.y);
        const w = Math.abs(this.end.x - this.start.x);
        const h = Math.abs(this.end.y - this.start.y);
        return p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h;
    }
    moveBy(dx, dy) {
        this.start.x += dx;
        this.start.y += dy;
        this.end.x += dx;
        this.end.y += dy;
    }
}
//# sourceMappingURL=RectFigure.js.map