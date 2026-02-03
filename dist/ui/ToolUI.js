export class ToolUI {
    constructor(getTool, setTool) {
        this.getTool = getTool;
        this.setTool = setTool;
    }
    init() {
        var _a, _b, _c, _d;
        (_a = document
            .getElementById("toolBrush")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.setTool("brush"));
        (_b = document
            .getElementById("toolRect")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => this.setTool("rect"));
        (_c = document
            .getElementById("toolEllipse")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => this.setTool("ellipse"));
        (_d = document
            .getElementById("toolLine")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => this.setTool("line"));
    }
}
//# sourceMappingURL=ToolUI.js.map