import type { Tool } from "../types.js";

export class ToolUI {
  constructor(
    private getTool: () => Tool,
    private setTool: (t: Tool) => void,
  ) {}

  init() {
    document
      .getElementById("toolBrush")
      ?.addEventListener("click", () => this.setTool("brush"));
    document
      .getElementById("toolRect")
      ?.addEventListener("click", () => this.setTool("rect"));
    document
      .getElementById("toolEllipse")
      ?.addEventListener("click", () => this.setTool("ellipse"));
    document
      .getElementById("toolLine")
      ?.addEventListener("click", () => this.setTool("line"));
    document
      .getElementById("toolEraser")
      ?.addEventListener("click", () => this.setTool("eraser"));
    document
      .getElementById("toolFill")
      ?.addEventListener("click", () => this.setTool("fill"));
  }
}
