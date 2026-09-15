import { gsap } from "gsap";

interface Point {
  x: number;
  y: number;
  seed: number;
  size: number;
}

const phaseTargets = [
  { development: 1, digitalization: 0, activation: 0 },
  { development: 0, digitalization: 1, activation: 0 },
  { development: 0, digitalization: 0, activation: 1 },
] as const;

const gridSize = 7;
const pointCount = gridSize * gridSize;

function createRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function initHeroIndicator(root: ParentNode = document): () => void {
  const canvas = root.querySelector<HTMLCanvasElement>("[data-hero-indicator]");
  if (!canvas) return () => undefined;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return () => undefined;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const selectedWord = root.querySelector<HTMLElement>('.rolling-word[aria-pressed="true"]');
  const phase = { ...(phaseTargets[Number(selectedWord?.dataset.index)] ?? phaseTargets[0]) };
  const random = createRandom(0x4e4f4e47);
  const points: Point[] = Array.from({ length: pointCount }, () => ({
    x: 0,
    y: 0,
    seed: random(),
    size: 0.55 + random() * 0.7,
  }));

  let width = 0;
  let height = 0;
  let frame = 0;
  let needsResize = true;
  let phaseTween: gsap.core.Tween | undefined;
  const isPaused = () => document.hidden || document.documentElement.classList.contains("is-index-open");

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = bounds.width;
    height = bounds.height;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    needsResize = false;
  };

  const positionPoints = () => {
    const size = Math.min(width, height);
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    points.forEach((point, index) => {
      const column = index % gridSize;
      const row = Math.floor(index / gridSize);
      const normalizedX = (column / (gridSize - 1)) * 2 - 1;
      const normalizedY = (row / (gridSize - 1)) * 2 - 1;
      const rowProgress = row / (gridSize - 1);

      const developmentX = centerX + normalizedX * size * 0.36;
      const developmentY = centerY + normalizedY * size * 0.27;

      const triangleHalfWidth = size * 0.36 * rowProgress;
      const digitalizationX = centerX + normalizedX * triangleHalfWidth;
      const digitalizationY = centerY + (rowProgress - 0.5) * size * 0.7;

      const activationX = centerX
        + normalizedX * Math.sqrt(1 - (normalizedY * normalizedY) / 2) * size * 0.35;
      const activationY = centerY
        + normalizedY * Math.sqrt(1 - (normalizedX * normalizedX) / 2) * size * 0.35;

      point.x = developmentX * phase.development
        + digitalizationX * phase.digitalization
        + activationX * phase.activation;
      point.y = developmentY * phase.development
        + digitalizationY * phase.digitalization
        + activationY * phase.activation;
    });
  };

  const drawGrid = () => {
    context.strokeStyle = "rgba(241, 240, 232, 0.24)";
    for (let row = 0; row < gridSize; row += 1) {
      context.beginPath();
      for (let column = 0; column < gridSize; column += 1) {
        const point = points[row * gridSize + column];
        if (column === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
      context.stroke();
    }
    for (let column = 0; column < gridSize; column += 1) {
      context.beginPath();
      for (let row = 0; row < gridSize; row += 1) {
        const point = points[row * gridSize + column];
        if (row === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
      context.stroke();
    }
  };

  const draw = (now = 0) => {
    if (needsResize) resize();
    context.clearRect(0, 0, width, height);
    context.lineWidth = 0.55;

    const time = reducedMotion.matches ? 0 : now * 0.001;
    positionPoints();
    drawGrid();

    points.forEach((point, index) => {
      const pulse = reducedMotion.matches ? 1 : 0.78 + Math.sin(time * 0.8 + point.seed * 8) * 0.18;
      context.beginPath();
      context.fillStyle = index % 3 === 0
        ? `rgba(241, 240, 232, ${0.78 * pulse})`
        : `rgba(218, 205, 161, ${0.7 * pulse})`;
      context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
      context.fill();
    });
  };

  const render = (now: number) => {
    draw(now);
    frame = reducedMotion.matches || isPaused() ? 0 : window.requestAnimationFrame(render);
  };

  const start = () => {
    if (frame || isPaused()) return;
    if (reducedMotion.matches) {
      draw(0);
      return;
    }
    frame = window.requestAnimationFrame(render);
  };

  const stop = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
  };

  const handleResize = () => {
    needsResize = true;
    if (reducedMotion.matches || isPaused()) draw(0);
  };
  const handleVisibility = () => {
    if (isPaused()) {
      stop();
      phaseTween?.pause();
    } else {
      phaseTween?.resume();
      start();
    }
  };
  const handleMotionChange = () => {
    stop();
    start();
  };
  const handlePhaseChange = (event: Event) => {
    const target = phaseTargets[(event as CustomEvent<{ index: number }>).detail.index];
    if (!target) return;

    phaseTween?.kill();
    if (reducedMotion.matches) {
      Object.assign(phase, target);
      draw(0);
      return;
    }
    phaseTween = gsap.to(phase, {
      ...target,
      duration: 0.9,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  };

  const hero = canvas.closest(".hero");
  window.addEventListener("resize", handleResize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);
  reducedMotion.addEventListener("change", handleMotionChange);
  hero?.addEventListener("hero-phase-change", handlePhaseChange);
  const indexObserver = new MutationObserver(handleVisibility);
  indexObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  resize();
  start();

  return () => {
    stop();
    phaseTween?.kill();
    window.removeEventListener("resize", handleResize);
    document.removeEventListener("visibilitychange", handleVisibility);
    reducedMotion.removeEventListener("change", handleMotionChange);
    hero?.removeEventListener("hero-phase-change", handlePhaseChange);
    indexObserver.disconnect();
  };
}
