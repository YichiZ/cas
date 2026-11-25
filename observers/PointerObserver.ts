export interface PointerStroke {
  type: "start" | "move" | "end";
  x: number;
  y: number;
  pressure: number;
  event: PointerEvent;
}

export type PointerCallback = (
  stroke: PointerStroke,
  target: HTMLCanvasElement,
  observer: PointerObserver
) => void;

export class PointerObserver {
  private controllers = new Map<HTMLCanvasElement, AbortController>();
  private domObserver: MutationObserver;

  constructor(private callback: PointerCallback, root: Node = document.body) {
    this.domObserver = new MutationObserver(() => {
      for (const el of this.controllers.keys()) {
        if (!el.isConnected) this.unobserve(el);
      }
    });
    this.domObserver.observe(root, { childList: true, subtree: true });
  }

  observe(canvas: HTMLCanvasElement): void {
    if (this.controllers.has(canvas)) return;
    const ac = new AbortController();
    this.controllers.set(canvas, ac);

    // Prevent mobile touch scrolling while drawing
    canvas.style.touchAction = "none";

    let isDrawing = false;

    const getCoords = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height),
      };
    };

    canvas.addEventListener(
      "pointerdown",
      (e) => {
        if (e.button !== 0) return; // Left click / primary touch only
        isDrawing = true;
        canvas.setPointerCapture(e.pointerId);
        const { x, y } = getCoords(e);
        this.callback({ type: "start", x, y, pressure: e.pressure, event: e }, canvas, this);
      },
      { signal: ac.signal }
    );

    canvas.addEventListener(
      "pointermove",
      (e) => {
        if (!isDrawing) return;
        const { x, y } = getCoords(e);
        this.callback({ type: "move", x, y, pressure: e.pressure, event: e }, canvas, this);
      },
      { signal: ac.signal }
    );

    const endStroke = (e: PointerEvent) => {
      if (!isDrawing) return;
      isDrawing = false;
      const { x, y } = getCoords(e);
      this.callback({ type: "end", x, y, pressure: e.pressure, event: e }, canvas, this);
    };

    canvas.addEventListener("pointerup", endStroke, { signal: ac.signal });
    canvas.addEventListener("pointercancel", endStroke, { signal: ac.signal });
  }

  unobserve(canvas: HTMLCanvasElement): void {
    this.controllers.get(canvas)?.abort();
    this.controllers.delete(canvas);
  }

  disconnect(): void {
    this.controllers.forEach((ac) => ac.abort());
    this.controllers.clear();
    this.domObserver.disconnect();
  }
}