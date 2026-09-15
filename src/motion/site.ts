import { initHeroIndicator } from "./heroIndicator";
import { initHeroRoll } from "./heroRoll";

let cleanups: Array<() => void> = [];

function initializeHero() {
  cleanups = [initHeroIndicator(), initHeroRoll()];
}

initializeHero();
window.addEventListener("pagehide", () => cleanups.forEach((cleanup) => cleanup()));
window.addEventListener("pageshow", (event) => {
  if (event.persisted) initializeHero();
});
