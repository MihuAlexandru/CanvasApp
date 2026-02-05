import { distancePointToSegment } from "../Helpers.js";
import { Figure } from "../Figure.js";
export class LineFigure extends Figure {
    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
        ctx.restore();
    }
    containsPoint(p) {
        const dist = distancePointToSegment(p, this.start, this.end);
        return dist <= this.width + 3;
    }
    moveBy(dx, dy) {
        this.start.x += dx;
        this.start.y += dy;
        this.end.x += dx;
        this.end.y += dy;
    }
}
//# sourceMappingURL=LineFigure.js.map