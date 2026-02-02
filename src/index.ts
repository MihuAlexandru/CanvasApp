type Point = { x: number; y: number };

type Stroke = {
  color: string;
  width: number;
  points: Point[];
};

class DrawingApp {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private paint = false;

  private strokes: Stroke[] = [];
  private currentStroke: Stroke | null = null;

  private brushColor = "#000000";
  private brushWidth = 3;

  constructor() {
    const canvasEl = document.getElementById("canvas");
    if (!(canvasEl instanceof HTMLCanvasElement)) {
      throw new Error("Canvas element with id='canvas' not found.");
    }

    const ctx = canvasEl.getContext("2d");
    if (!ctx) {
      throw new Error("2D rendering context not available.");
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.strokeStyle = this.brushColor;

    ctx.lineWidth = 1;

    this.canvas = canvasEl;
    this.context = ctx;

    this.createUserEvents();
    this.createColorPickerEvents();
    this.createBrushSizeEvents();
    this.redraw();
  }

  private createUserEvents() {
    const canvas = this.canvas;

    canvas.addEventListener("mousedown", this.pressEventHandler);
    canvas.addEventListener("mousemove", this.dragEventHandler);
    canvas.addEventListener("mouseup", this.releaseEventHandler);
    canvas.addEventListener("mouseout", this.cancelEventHandler);

    canvas.addEventListener("touchstart", this.pressEventHandler, {
      passive: false,
    });
    canvas.addEventListener("touchmove", this.dragEventHandler, {
      passive: false,
    });
    canvas.addEventListener("touchend", this.releaseEventHandler);
    canvas.addEventListener("touchcancel", this.cancelEventHandler);

    document
      .getElementById("clear")
      ?.addEventListener("click", this.clearEventHandler);
  }

  private createColorPickerEvents() {
    const picker = document.getElementById("colorPicker");
    if (!(picker instanceof HTMLInputElement)) {
      console.warn("Color picker #colorPicker not found.");
      return;
    }

    const valueLabel = document.getElementById("colorValue");

    this.setBrushColor(picker.value);
    if (valueLabel) valueLabel.textContent = picker.value;

    picker.addEventListener("input", () => {
      this.setBrushColor(picker.value);
      if (valueLabel) valueLabel.textContent = picker.value;
    });
  }

  private setBrushColor(color: string) {
    this.brushColor = color;
    this.context.strokeStyle = color;
  }

  private redraw() {
    const ctx = this.context;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const stroke of this.strokes) {
      const pts = stroke.points;
      if (pts.length === 0) continue;

      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();

      ctx.moveTo(pts[0]!.x, pts[0]!.y);

      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        if (!p) continue;
        ctx.lineTo(p.x, p.y);
      }

      ctx.stroke();
      ctx.closePath();
    }
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.strokes = [];
    this.currentStroke = null;
  }

  private clearEventHandler = () => {
    this.clearCanvas();
  };

  private releaseEventHandler = () => {
    this.paint = false;
    this.currentStroke = null;
  };

  private cancelEventHandler = () => {
    this.paint = false;
    this.currentStroke = null;
  };

  private getPoint(e: MouseEvent | TouchEvent) {
    const rect = this.canvas.getBoundingClientRect();

    if ("changedTouches" in e) {
      const touch = e.changedTouches.item(0);
      if (!touch) {
        return { x: 0, y: 0 };
      }

      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  private pressEventHandler = (e: MouseEvent | TouchEvent) => {
    const { x, y } = this.getPoint(e);

    this.paint = true;

    this.currentStroke = {
      color: this.brushColor,
      width: this.brushWidth,
      points: [{ x, y }],
    };

    this.strokes.push(this.currentStroke);

    this.redraw();

    if ("changedTouches" in e) e.preventDefault();
  };

  private dragEventHandler = (e: MouseEvent | TouchEvent) => {
    if (!this.paint || !this.currentStroke) return;

    const { x, y } = this.getPoint(e);
    this.currentStroke.points.push({ x, y });

    this.redraw();

    if ("changedTouches" in e) e.preventDefault();
  };

  private createBrushSizeEvents() {
    const sizeValue = document.getElementById("sizeValue");

    const radios = document.querySelectorAll<HTMLInputElement>(
      'input[name="brushSize"]',
    );

    if (!radios.length) {
      console.warn("No brush size radios found (name='brushSize').");
      return;
    }

    const checked = Array.from(radios).find((r) => r.checked) ?? radios[0];
    if (checked) {
      this.setBrushWidth(Number(checked.value));
      if (sizeValue) sizeValue.textContent = `Size: ${this.brushWidth}px`;
    }

    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (!radio.checked) return;
        this.setBrushWidth(Number(radio.value));
        if (sizeValue) sizeValue.textContent = `Size: ${this.brushWidth}px`;
      });
    });
  }
  private setBrushWidth(width: number) {
    const w = Number.isFinite(width) ? Math.max(1, Math.min(50, width)) : 2;
    this.brushWidth = w;
    this.context.lineWidth = w;
  }
}

new DrawingApp();
