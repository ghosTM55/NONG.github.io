import { initEmailCopy } from "./emailCopy";
import { initIndexPanel } from "./indexPanel";
import { initLanguageMenus } from "./languageMenus";
import { initChapterNavigation } from "./chapterNavigation";

let cleanups: Array<() => void> = [];

function initializeNavigation() {
  const languages = initLanguageMenus();
  cleanups = [initEmailCopy(), initIndexPanel(languages.closeAll), initChapterNavigation(), languages.destroy];
}

initializeNavigation();
window.addEventListener("pagehide", () => cleanups.forEach((cleanup) => cleanup()));
window.addEventListener("pageshow", (event) => {
  if (event.persisted) initializeNavigation();
});
