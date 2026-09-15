import { initSiteBackground } from "./heroBackground";
import { initFlowBackground } from "./flowBackground";

function initialize() {
  const mode = document.querySelector<HTMLElement>("[data-site-background]")?.dataset.siteBackground;
  if (mode !== "intro" && mode !== "curation") return initSiteBackground();
  const stopFlow = initFlowBackground(mode);
  const main = document.querySelector<HTMLElement>("body > main");
  const originalClip = main?.style.clipPath ?? "";
  let headerBottom = 0;
  // Clip the scrolling content, not the shared background. A solid header cover
  // would reintroduce the seam; no cover would let films overlap the wordmark.
  const clipContent = () => {
    if (main) main.style.clipPath = `inset(${Math.max(0, headerBottom - main.getBoundingClientRect().top)}px 0 0)`;
  };
  const resize = () => {
    headerBottom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--index-panel-top"));
    clipContent();
  };
  resize();
  window.addEventListener("scroll", clipContent, { passive: true, capture: true });
  window.addEventListener("resize", resize, { passive: true });
  return () => {
    stopFlow();
    window.removeEventListener("scroll", clipContent, true);
    window.removeEventListener("resize", resize);
    if (main) main.style.clipPath = originalClip;
  };
}

let cleanup = initialize();

window.addEventListener("pagehide", () => cleanup());
window.addEventListener("pageshow", (event) => {
  if (event.persisted) cleanup = initialize();
});
