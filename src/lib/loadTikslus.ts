// Loads jQuery and the lecturer-provided tikslus360 plugin from /public/js, in order, once.

type JQueryish = ((el: Element) => { tikslus360: (opts: Record<string, unknown>) => void }) & {
  fn?: { tikslus360?: unknown };
};

declare global {
  interface Window {
    jQuery?: JQueryish;
  }
}

let pending: Promise<JQueryish> | null = null;

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing?.dataset.loaded) return resolve();
    const s = existing ?? document.createElement("script");
    s.src = src;
    s.addEventListener("load", () => {
      s.dataset.loaded = "1";
      resolve();
    });
    s.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)));
    if (!existing) document.body.appendChild(s);
  });
}

export function loadTikslus(): Promise<JQueryish> {
  if (window.jQuery?.fn?.tikslus360) return Promise.resolve(window.jQuery);
  pending ??= (async () => {
    if (!window.jQuery) await loadScript("/js/jquery.min.js");
    await loadScript("/js/tikslus360.js");
    return window.jQuery!;
  })();
  return pending;
}
