export class ToolUI {
    constructor(getTool, setTool) {
        this.getTool = getTool;
        this.setTool = setTool;
        this.buttons = [];
    }
    init() {
        const toolMap = {
            toolBrush: "brush",
            toolRect: "rect",
            toolEllipse: "ellipse",
            toolLine: "line",
            toolEraser: "eraser",
            toolFill: "fill",
        };
        this.buttons = Object.keys(toolMap)
            .map((id) => document.getElementById(id))
            .filter((el) => el instanceof HTMLButtonElement);
        for (const btn of this.buttons) {
            const tool = toolMap[btn.id];
            if (!tool)
                continue;
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
    updateActiveButton(activeBtn) {
        this.buttons.forEach((btn) => btn.classList.remove("active-tool"));
        activeBtn.classList.add("active-tool");
    }
}
//# sourceMappingURL=ToolUI.js.map