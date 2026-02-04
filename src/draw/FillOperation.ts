import type { Drawable } from "./Drawable.js";

export class FillOperation implements Drawable {
  constructor(
    private x: number,
    private y: number,
    private width: number,
    private height: number,
    private imageData: ImageData,
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.putImageData(this.imageData, this.x, this.y);
  }

  static run(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    fillColor: [number, number, number, number],
  ): FillOperation | null {
    const { width, height } = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const getPixel = (x: number, y: number) => {
      const i = (y * width + x) * 4;
      return [data[i], data[i + 1], data[i + 2], data[i + 3]];
    };

    const setPixel = (x: number, y: number) => {
      const i = (y * width + x) * 4;
      data[i] = fillColor[0];
      data[i + 1] = fillColor[1];
      data[i + 2] = fillColor[2];
      data[i + 3] = fillColor[3];
    };

    const targetColor = getPixel(startX, startY);
    if (targetColor.toString() === fillColor.toString()) return null;

    const queue = [{ x: startX, y: startY }];
    const visited = new Set<string>();

    let minX = startX,
      maxX = startX;
    let minY = startY,
      maxY = startY;

    const key = (x: number, y: number) => `${x},${y}`;

    while (queue.length) {
      const { x, y } = queue.shift()!;
      const k = key(x, y);
      if (visited.has(k)) continue;
      visited.add(k);

      const current = getPixel(x, y);
      if (current.toString() !== targetColor.toString()) continue;

      setPixel(x, y);

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);

      if (x > 0) queue.push({ x: x - 1, y });
      if (x < width - 1) queue.push({ x: x + 1, y });
      if (y > 0) queue.push({ x, y: y - 1 });
      if (y < height - 1) queue.push({ x, y: y + 1 });
    }

    const regionWidth = maxX - minX + 1;
    const regionHeight = maxY - minY + 1;

    const regionData = new ImageData(regionWidth, regionHeight);

    for (let y = 0; y < regionHeight; y++) {
      for (let x = 0; x < regionWidth; x++) {
        const srcIndex = ((minY + y) * width + (minX + x)) * 4;
        const dstIndex = (y * regionWidth + x) * 4;
        regionData.data[dstIndex] = data[srcIndex]!;
        regionData.data[dstIndex + 1] = data[srcIndex + 1]!;
        regionData.data[dstIndex + 2] = data[srcIndex + 2]!;
        regionData.data[dstIndex + 3] = data[srcIndex + 3]!;
      }
    }

    return new FillOperation(minX, minY, regionWidth, regionHeight, regionData);
  }
}
