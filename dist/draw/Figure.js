export class Figure {
    constructor(color, width, start, end) {
        this.color = color;
        this.width = width;
        this.start = start;
        this.end = end;
    }
    updateEnd(p) {
        this.end = p;
    }
    getBounds() {
        const x = Math.min(this.start.x, this.end.x);
        const y = Math.min(this.start.y, this.end.y);
        const w = Math.abs(this.end.x - this.start.x);
        const h = Math.abs(this.end.y - this.start.y);
        return { x, y, w, h };
    }
}
//# sourceMappingURL=Figure.js.map