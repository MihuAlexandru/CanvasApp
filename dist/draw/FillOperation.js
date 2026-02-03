export class FillOperation {
    constructor(x, y, width, height, imageData) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imageData = imageData;
    }
    draw(ctx) {
        ctx.putImageData(this.imageData, this.x, this.y);
    }
}
//# sourceMappingURL=FillOperation.js.map