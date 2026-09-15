import { gsap } from "gsap";

type WordPosition = "previous" | "active" | "next";

const cycleDuration = 4.5;

export function initHeroRoll(root: ParentNode = document): () => void {
  const stage = root.querySelector<HTMLElement>("[data-hero-roll]");
  if (!stage) return () => undefined;

  const words = Array.from(stage.querySelectorAll<HTMLElement>(".rolling-word"));
  const progress = stage.querySelector<HTMLElement>("[data-roll-progress]");
  const contextItems = Array.from(
    root.querySelectorAll<HTMLElement>("[data-hero-context-item]"),
  );
  if (words.length < 2 || !progress) return () => undefined;

  let activeWord = Math.max(0, words.findIndex((word) => word.getAttribute("aria-pressed") === "true"));
  let restartCycle: (() => void) | undefined;

  const getPosition = (index: number): WordPosition => {
    if (index === activeWord) return "active";
    if (index === (activeWord + 1) % words.length) return "next";
    return "previous";
  };

  const selectWord = (nextWord: number) => {
    if (nextWord === activeWord) return;

    const forwardDistance = (nextWord - activeWord + words.length) % words.length;
    const wrappingPosition = forwardDistance === 1 ? "previous" : "next";
    const wrappingWord = words.find((word) => word.dataset.position === wrappingPosition);

    wrappingWord?.classList.add("is-wrapping");
    activeWord = nextWord;
    words.forEach((word, index) => {
      const isActive = index === activeWord;
      word.dataset.position = getPosition(index);
      word.setAttribute("aria-pressed", String(isActive));
    });
    progress.style.setProperty("--roll-index", String(activeWord));
    contextItems.forEach((item, index) => {
      const isActive = index === activeWord;
      item.dataset.active = String(isActive);
      item.setAttribute("aria-hidden", String(!isActive));
    });
    stage.dispatchEvent(
      new CustomEvent("hero-phase-change", {
        bubbles: true,
        detail: { index: activeWord },
      }),
    );

    if (wrappingWord) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => wrappingWord.classList.remove("is-wrapping"));
      });
    }
  };

  const advance = () => selectWord((activeWord + 1) % words.length);

  const handleWordClick = (event: Event) => {
    const word = event.currentTarget as HTMLElement;
    const selectedIndex = Number(word.dataset.index);
    if (!Number.isInteger(selectedIndex)) return;

    selectWord(selectedIndex);
    restartCycle?.();
  };

  words.forEach((word) => word.addEventListener("click", handleWordClick));

  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    const timeline = gsap.timeline({ paused: true, repeat: -1 });
    timeline.call(advance, [], cycleDuration);
    restartCycle = () => timeline.restart();

    const isPaused = () => document.hidden || document.documentElement.classList.contains("is-index-open");
    const handleVisibility = () => {
      if (isPaused()) timeline.pause();
      else timeline.resume();
    };

    if (!isPaused()) timeline.play();
    document.addEventListener("visibilitychange", handleVisibility);
    const indexObserver = new MutationObserver(handleVisibility);
    indexObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      restartCycle = undefined;
      timeline.kill();
      document.removeEventListener("visibilitychange", handleVisibility);
      indexObserver.disconnect();
    };
  });

  return () => {
    media.revert();
    words.forEach((word) => word.removeEventListener("click", handleWordClick));
  };
}
