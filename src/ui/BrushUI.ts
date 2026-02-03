export class BrushUI {
  constructor(
    private setColor: (c: string) => void,
    private setWidth: (w: number) => void,
    private getWidth: () => number,
  ) {}

  init() {
    const picker = document.getElementById("colorPicker");
    const valueLabel = document.getElementById("colorValue");
    if (picker instanceof HTMLInputElement) {
      this.setColor(picker.value);
      if (valueLabel) valueLabel.textContent = picker.value;
      picker.addEventListener("input", () => {
        this.setColor(picker.value);
        if (valueLabel) valueLabel.textContent = picker.value;
      });
    }

    const sizeValue = document.getElementById("sizeValue");
    const radios = document.querySelectorAll<HTMLInputElement>(
      'input[name="brushSize"]',
    );
    if (!radios.length) return;

    const checked = Array.from(radios).find((r) => r.checked) ?? radios[0]!;
    this.setWidth(Number(checked.value));
    if (sizeValue) sizeValue.textContent = `Size: ${this.getWidth()}px`;

    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (!radio.checked) return;
        this.setWidth(Number(radio.value));
        if (sizeValue) sizeValue.textContent = `Size: ${this.getWidth()}px`;
      });
    });
  }
}
