import type { Tool } from "../utils/types.js";

export class ToolUI {
  private buttons: HTMLButtonElement[] = [];

  constructor(
    private getTool: () => Tool,
    private setTool: (t: Tool) => void,
  ) {}

  init() {
    const toolMap: Record<string, Tool> = {
      toolBrush: "brush",
      toolRect: "rect",
      toolEllipse: "ellipse",
      toolLine: "line",
      toolEraser: "eraser",
      toolFill: "fill",
      toolSelect: "select",
    };

    this.buttons = Object.keys(toolMap)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLButtonElement => el instanceof HTMLButtonElement);

    for (const btn of this.buttons) {
      const tool = toolMap[btn.id];
      if (!tool) continue;
      btn.addEventListener("click", () => {
        this.setTool(tool);
        this.updateActiveButton(btn);
      });
    }

    const initial = document.getElementById("toolBrush");
    if (initial instanceof HTMLButtonElement) {
      this.updateActiveButton(initial);
    }
  }

  private updateActiveButton(activeBtn: HTMLButtonElement) {
    this.buttons.forEach((btn) => btn.classList.remove("active-tool"));
    activeBtn.classList.add("active-tool");
  }
}
