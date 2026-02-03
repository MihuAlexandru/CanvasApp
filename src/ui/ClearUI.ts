export class ClearUI {
  constructor(private clear: () => void) {}
  init() {
    document.getElementById("clear")?.addEventListener("click", this.clear);
  }
}
