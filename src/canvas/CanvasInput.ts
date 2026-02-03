import type { Point } from "../types.js";

type Handlers = {
  onDown(p: Point, e: PointerEvent): void;
  onMove(p: Point, e: PointerEvent): void;
  onUp(e: PointerEvent): void;
};

export class CanvasInput {
  constructor(
    private canvas: HTMLCanvasElement,
    private handlers: Handlers,
  ) {
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

  private getPoint(e: PointerEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private pointerDown = (e: PointerEvent) => {
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    this.handlers.onDown(this.getPoint(e), e);
  };

  private pointerMove = (e: PointerEvent) => {
    if (e.buttons === 0) return;
    e.preventDefault();
    this.handlers.onMove(this.getPoint(e), e);
  };

  private pointerUp = (e: PointerEvent) => {
    this.handlers.onUp(e);
  };
}
