export class BrushUI {
    constructor(setColor, setWidth, getWidth) {
        this.setColor = setColor;
        this.setWidth = setWidth;
        this.getWidth = getWidth;
    }
    init() {
        var _a;
        const picker = document.getElementById("color-picker");
        const valueLabel = document.getElementById("color-value");
        if (picker instanceof HTMLInputElement) {
            this.setColor(picker.value);
            if (valueLabel)
                valueLabel.textContent = picker.value;
            picker.addEventListener("input", () => {
                this.setColor(picker.value);
                if (valueLabel)
                    valueLabel.textContent = picker.value;
            });
        }
        const sizeValue = document.getElementById("size-value");
        const radios = document.querySelectorAll('input[name="brush-size"]');
        if (!radios.length)
            return;
        const checked = (_a = Array.from(radios).find((r) => r.checked)) !== null && _a !== void 0 ? _a : radios[0];
        this.setWidth(Number(checked.value));
        if (sizeValue)
            sizeValue.textContent = `Size: ${this.getWidth()}px`;
        radios.forEach((radio) => {
            radio.addEventListener("change", () => {
                if (!radio.checked)
                    return;
                this.setWidth(Number(radio.value));
                if (sizeValue)
                    sizeValue.textContent = `Size: ${this.getWidth()}px`;
            });
        });
    }
}
//# sourceMappingURL=BrushUI.js.map