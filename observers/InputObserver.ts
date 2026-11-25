export type InputCallback = (
  value: string,
  target: HTMLInputElement,
  observer: InputObserver
) => void;

export class InputObserver {
  private controllers = new Map<HTMLInputElement, AbortController>();
  private domObserver: MutationObserver;

  constructor(private callback: InputCallback, root: Node = document.body) {
    this.domObserver = new MutationObserver(() => {
      for (const el of this.controllers.keys()) {
        if (!el.isConnected) this.unobserve(el);
      }
    });
    this.domObserver.observe(root, { childList: true, subtree: true });
  }

  observe(el: HTMLInputElement): void {
    if (this.controllers.has(el)) return;
    const ac = new AbortController();
    this.controllers.set(el, ac);
    el.addEventListener("input", () => this.callback(el.value, el, this), {
      signal: ac.signal,
    });
  }

  unobserve(el: HTMLInputElement): void {
    this.controllers.get(el)?.abort();
    this.controllers.delete(el);
  }

  disconnect(): void {
    this.controllers.forEach((ac) => ac.abort());
    this.controllers.clear();
    this.domObserver.disconnect();
  }
}